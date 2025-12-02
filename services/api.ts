import { GenerateVideoParams } from '../types';
import { WEBHOOK_URL } from '../constants';

/**
 * Helper to recursively find a URL string in a nested JSON object.
 * Searches for common keys like 'url', 'link', 'video', etc.
 */
const findUrl = (obj: any): string | undefined => {
  if (!obj) return undefined;
  
  if (typeof obj === 'string' && obj.match(/^https?:\/\//i)) {
      return obj;
  }

  if (typeof obj === 'object') {
    // Check priority keys
    const priorityKeys = ['url', 'video_url', 'link', 'output', 'video', 'file', 'uri', 'download_url'];
    for (const key of priorityKeys) {
        if (obj[key] && typeof obj[key] === 'string' && obj[key].match(/^https?:\/\//i)) {
            return obj[key];
        }
    }

    // Check wrapper keys recursively
    if (obj.json) {
        const found = findUrl(obj.json);
        if (found) return found;
    }
    if (obj.data) {
        const found = findUrl(obj.data);
        if (found) return found;
    }
    if (obj.body) {
        const found = findUrl(obj.body);
        if (found) return found;
    }

    // Shallow fallback search in all keys
    for (const key in obj) {
         const val = obj[key];
         if (typeof val === 'string' && val.match(/^https?:\/\//i)) {
             return val;
         }
    }
  }
  return undefined;
};

/**
 * Sends the hospital details and images to the n8n webhook.
 * The n8n AI agent will handle script generation.
 */
export const generateVideo = async ({ details, images }: GenerateVideoParams): Promise<string> => {
  // Validate and sanitize URL
  let url = WEBHOOK_URL.trim();
  
  if (!url || url.includes('YOUR_N8N_WEBHOOK_URL_HERE')) {
    throw new Error("Please configure the valid n8n Webhook URL in constants.ts");
  }

  // Auto-correct common protocol typos
  if (url.startsWith('yhttps')) {
      console.warn("Auto-correcting malformed URL protocol 'yhttps' to 'https'");
      url = url.replace(/^yhttps/, 'https');
  }

  const formData = new FormData();
  
  // Append Hospital Details as text fields
  formData.append('hospitalName', details.name);
  formData.append('email', details.email);
  formData.append('doctorName', details.doctorName);
  formData.append('specialty', details.specialty);
  formData.append('timings', details.timings);
  formData.append('services', details.services);

  // Append Multiple Images
  // CRITICAL: We use 'data' as the key because n8n Webhook (Binary) nodes often default 
  // to looking for the 'data' property. 
  images.forEach((file) => {
    formData.append('data', file);
  });

  console.log(`[API] Sending request to: ${url}`);
  console.log(`[API] Files attached: ${images.length} (Key: 'data')`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors', // Explicitly request CORS
      headers: {
        'Accept': 'application/json, text/plain, */*',
        // Note: Do NOT set Content-Type manually for FormData; browser handles it.
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Generation failed with status: ${response.status} ${errorText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    console.log(`[API] Response Content-Type: ${contentType}`);

    // CHECK 1: Handle JSON Response (Standard or containing URL)
    if (contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      console.log("[API] Raw JSON response:", jsonResponse);

      let resultItem = jsonResponse;
      if (Array.isArray(jsonResponse)) {
          resultItem = jsonResponse[0] || {};
      }

      const videoUrl = findUrl(resultItem);

      if (!videoUrl) {
        if (resultItem.message && typeof resultItem.message === 'string') {
           throw new Error(`Webhook response message: ${resultItem.message}`);
        }
        const receivedKeys = typeof resultItem === 'object' ? Object.keys(resultItem).join(', ') : String(resultItem);
        throw new Error(`Video generated, but could not find a 'url' link in the JSON response. Debug: Received keys [${receivedKeys}]`);
      }

      return videoUrl;
    } 
    
    // CHECK 2: Handle Binary Response (Direct File / Blob)
    // This handles cases where n8n 'Respond to Webhook' is set to 'Binary File'
    else {
      console.log("[API] Receiving binary data...");
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("Received empty response from server.");
      }
      
      // INSPECTION: Check if the binary blob is actually a hidden JSON error.
      // Sometimes n8n or proxies return JSON errors without the correct Content-Type header.
      // We peek at the first 50 chars to see if it looks like JSON.
      try {
        const textStart = await blob.slice(0, 50).text();
        const trimmed = textStart.trim();
        
        // If it starts with { or [ and isn't explicitly an image/video type
        if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && !contentType.includes('video') && !contentType.includes('image')) {
            const fullText = await blob.text();
            try {
                const json = JSON.parse(fullText);
                console.log("[API] Detected JSON hidden in blob:", json);
                
                // If it's a JSON error message
                if (json.message) {
                    throw new Error(`Server Message: ${json.message}`);
                }
                
                // If it's actually a JSON object containing a URL (misconfigured header)
                const urlFromBlob = findUrl(json);
                if (urlFromBlob) return urlFromBlob;
                
            } catch (e) {
                // If JSON parse fails, it might just be a text file or actual binary starting with {
                // Ignore and proceed to treat as binary
            }
        }
      } catch (e) {
        // Ignore sniffing errors
      }

      const objectUrl = URL.createObjectURL(blob);
      console.log("[API] Created Object URL from binary response:", objectUrl);
      return objectUrl;
    }

  } catch (error: any) {
    console.error("API Service Error:", error);

    if (error.name === 'TypeError' && error.message && error.message.includes('URL scheme')) {
        throw new Error(`Invalid URL configuration in constants.ts: ${error.message}`);
    }
    
    if (error.name === 'TypeError' && error.message && error.message.includes('fetch')) {
       // Comprehensive CORS error instruction
       throw new Error(`Network Error (CORS): The request was blocked by the browser.
       
To fix this in n8n:
1. Open your n8n workflow.
2. Click on the "Respond to Webhook" node.
3. Under "Options", click "Add Option" -> "Response Headers".
4. Add Header Name: "Access-Control-Allow-Origin"
5. Add Header Value: "*"
       
If using the default Webhook node (GET/POST), ensure "Allowed Origins (CORS)" is set to "*" in the node settings.`);
    }
    throw error;
  }
};
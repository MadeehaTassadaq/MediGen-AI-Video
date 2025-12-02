export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface VideoResponseItem {
  url: string;
}

export type VideoApiResponse = VideoResponseItem[];

export interface HospitalDetails {
  name: string;
  email: string;
  doctorName: string;
  specialty: string;
  timings: string;
  services: string;
}

export interface GenerateVideoParams {
  details: HospitalDetails;
  images: File[];
}
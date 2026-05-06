export interface UploadResponse {
  url: string;
  message: string;
}

export interface VoiceRecorderProps {
  onAudioUpload: (url: string) => void;
  maxDuration?: number;
}
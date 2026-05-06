import type { UploadResponse } from '../types/upload';
import api from './api';

export const uploadService = {
  // Upload audio file
  uploadAudio: async (audio: File | Blob, filename?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    
    // Convert Blob to File if needed
    let file: File;
    if (audio instanceof Blob && !(audio instanceof File)) {
      file = new File([audio], filename || `recording-${Date.now()}.webm`, { 
        type: audio.type || 'audio/webm',
        lastModified: Date.now()
      });
    } else {
      file = audio as File;
    }
    
    formData.append('audio', file);
    
    const response = await api.post('/api/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
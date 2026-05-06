import api from './api';

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  mongodb: string;
  environment: string;
}

export const healthService = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get('/health');
    return response.data;
  }
};

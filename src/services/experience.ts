import type { CreateExperienceData, ExperienceData, ExperienceResponse } from '../types/experience';
import api from './api';

export const experienceService = {
  // Create a new experience
  create: async (data: CreateExperienceData): Promise<ExperienceResponse> => {
    const response = await api.post('/api/experience', data);
    return response.data;
  },

  // Get experience by ID
  getById: async (id: string): Promise<ExperienceData> => {
    const response = await api.get(`/api/experience/${id}`);
    return response.data;
  },
};
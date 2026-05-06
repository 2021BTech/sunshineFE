
export interface CreateExperienceData {
  recipientName: string;
  message: string;
  theme: 'romantic' | 'calm' | 'playful';
  scheduledAt: string;
  audioUrl?: string | null;
}

export interface ExperienceResponse {
  id: string;
  message: string;
}

export interface ExperienceData {
  recipientName: string;
  message: string;
  theme: string;
  audioUrl: string | null;
  scheduledAt: string;
  viewCount: number;
  createdAt: string;
}

export interface Experience {
  recipientName: string;
  message: string;
  theme: string;
  audioUrl?: string;
  scheduledAt: string;
}

export type ThemeType = 'romantic' | 'calm' | 'playful';

export interface ThemeOption {
  id: ThemeType;
  name: string;
  icon: string;
  color: string;
}

export interface ThemeCardProps {
  theme: ThemeOption;
  selected: boolean;
  onSelect: () => void;
}
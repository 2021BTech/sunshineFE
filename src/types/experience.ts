
export interface CreateExperienceData {
  recipientName: string;
  message: string;
  theme: ThemeType;
  greeting?: string;
  scheduledAt: string;
  audioUrl?: string | null;
}

export interface ExperienceResponse {
  id: string;
  message: string;
}

export interface ExperienceData {
  id: string;
  recipientName: string;
  message: string;
  theme: ThemeType;
  greeting?: string;
  audioUrl?: string;
  scheduledAt: string;
  createdAt: string;
  delivered: boolean;
}

export interface Experience {
  recipientName: string;
  message: string;
  theme: string;
  audioUrl?: string;
  scheduledAt: string;
}

export type ThemeType = 'romantic' | 'calm' | 'playful' | 'birthday' | 'anniversary';

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
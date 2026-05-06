export interface TimeUntil {
  hours: number;
  minutes: number;
}

export function calculateTimeUntil(targetDate: Date): TimeUntil {
  const now = new Date();
  const timeUntil = targetDate.getTime() - now.getTime();
  
  return {
    hours: Math.floor(timeUntil / (1000 * 60 * 60)),
    minutes: Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60))
  };
}

export function formatTimeUntil(timeUntil: TimeUntil): string {
  return `${timeUntil.hours}h ${timeUntil.minutes}m`;
}

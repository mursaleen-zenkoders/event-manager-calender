import { timeToMinutes } from "./time-to-minute";

export function isWithinWorkingHours(
  times: { startTime: string; endTime: string }[],
  workingHour: string
) {
  // Calculate total duration in minutes for all events
  const totalDurationMinutes = times.reduce((acc, curr) => {
    const startMinutes = timeToMinutes(curr.startTime);
    const endMinutes = timeToMinutes(curr.endTime);
    return acc + (endMinutes - startMinutes);
  }, 0);

  // Convert working hours to minutes
  const workingMinutes = +workingHour * 60;

  // Check if total duration is less than or equal to working hours
  return totalDurationMinutes <= workingMinutes;
}

export function isWithinWorkingHours(
  startTime: string,
  endTime: string,
  workingHour: string
) {
  // Helper function to convert time string (HH:MM) to minutes
  function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Convert start and end times to minutes
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Calculate duration in minutes
  const durationMinutes = endMinutes - startMinutes;

  // Convert working hours to minutes
  const workingMinutes = +workingHour * 60;

  // Check if duration is less than or equal to working hours
  return durationMinutes <= workingMinutes;
}

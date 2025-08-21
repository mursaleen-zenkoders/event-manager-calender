import { TimeSlotT } from "@/components/settings/hours-configuration";
import { timeToMinutes } from "./time-to-minute";

interface TimeData {
  timeSlot: TimeSlotT[];
  startTime: string;
  endTime: string;
}

export function isTimeWithinSlots(data: TimeData): boolean {
  const { timeSlot, startTime, endTime } = data;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Check if startTime and endTime fall within any time slot
  return timeSlot.some((slot) => {
    const slotStart = timeToMinutes(slot.from);
    const slotEnd = timeToMinutes(slot.to);
    return startMinutes >= slotStart && endMinutes <= slotEnd;
  });
}

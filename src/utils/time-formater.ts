import EventT from "@/types/event.type";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatEventTime = (
  event: EventT,
  selectedTimezone: string
): Partial<EventT & { start: Date; end: Date; updatedTimezone: string }> => {
  const { date, startTime, endTime, color, title } = event;

  // Combine date and time, assuming startTime and endTime are in UTC
  const start = dayjs.utc(`${date} ${startTime}`, "YYYY-MM-DD HH:mm:ss");
  const end = dayjs.utc(`${date} ${endTime}`, "YYYY-MM-DD HH:mm:ss");

  // Validate date and time inputs
  if (!start.isValid() || !end.isValid()) {
    console.error(`Invalid date/time: ${date} ${startTime}/${endTime}`);
    throw new Error("Invalid date or time format");
  }

  // Validate selected timezone
  try {
    dayjs.tz(start, selectedTimezone);
  } catch (error) {
    console.log("🚀 ~ formatEventTime ~ error:", error);
    console.error(`Invalid selected timezone: ${selectedTimezone}`);
    throw new Error(`Invalid selected timezone: ${selectedTimezone}`);
  }

  // Convert UTC times to the selected timezone
  const convertedStart = start.tz(selectedTimezone);
  const convertedEnd = end.tz(selectedTimezone);

  return {
    ...event,
    date: convertedStart.format("YYYY-MM-DD"), // Update date in case of day change
    startTime: convertedStart.format("h:mm A"), // e.g., "10:30 PM"
    endTime: convertedEnd.format("h:mm A"), // e.g., "12:30 AM"
    updatedTimezone: selectedTimezone,
    start: convertedStart.toDate(),
    end: convertedEnd.toDate(),
    color,
    title,
  };
};

export default formatEventTime;

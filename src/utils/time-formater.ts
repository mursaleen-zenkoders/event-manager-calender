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
  const { date, startTime, endTime, timeZone, color, title } = event;

  // Validate date and time inputs
  const start = dayjs(`${date} ${startTime}`, "YYYY-MM-DD HH:mm:ss");
  const end = dayjs(`${date} ${endTime}`, "YYYY-MM-DD HH:mm:ss");

  if (!start.isValid() || !end.isValid()) {
    console.error(`Invalid date/time: ${date} ${startTime}/${endTime}`);
    throw new Error("Invalid date or time format");
  }

  // Validate timezones by attempting to apply them
  try {
    dayjs.tz(start, timeZone); // Test event timezone
  } catch (error) {
    console.log("🚀 ~ formatEventTime ~ error:", error);
    console.error(`Invalid event timezone: ${timeZone}`);
    throw new Error(`Invalid event timezone: ${timeZone}`);
  }

  try {
    dayjs.tz(start, selectedTimezone); // Test selected timezone
  } catch (error) {
    console.log("🚀 ~ formatEventTime ~ error:", error);
    console.error(`Invalid selected timezone: ${selectedTimezone}`);
    throw new Error(`Invalid selected timezone: ${selectedTimezone}`);
  }

  // Apply original timezone
  const zonedStart = start.tz(timeZone, true); // Preserve exact time
  const zonedEnd = end.tz(timeZone, true);

  // Convert to selected timezone
  const convertedStart = zonedStart.tz(selectedTimezone);
  const convertedEnd = zonedEnd.tz(selectedTimezone);

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

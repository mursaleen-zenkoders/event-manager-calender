import EventT from "@/types/event.type";
import moment from "moment-timezone";

export function checkTimeOverlap(
  newEvent: EventT,
  existingEvents: EventT[],
  bufferTime: number
) {
  // Normalize time format (append :00 if needed)
  const normalizeTime = (time: string) => {
    if (time.split(":").length === 2) return `${time}:00`;
    return time;
  };

  // Use specified times for new event
  const newStartUTC = moment
    .tz(
      `${newEvent.date} ${normalizeTime(newEvent.startTime)}`,
      "YYYY-MM-DD HH:mm:ss",
      newEvent.timeZone
    )
    .utc();
  const newEndUTC = moment
    .tz(
      `${newEvent.date} ${normalizeTime(newEvent.endTime)}`,
      "YYYY-MM-DD HH:mm:ss",
      newEvent.timeZone
    )
    .utc();

  // Check for invalid new event dates
  if (
    !newStartUTC.isValid() ||
    !newEndUTC.isValid() ||
    newStartUTC.isAfter(newEndUTC)
  ) {
    return { hasOverlap: false, error: "Invalid new event date or time" };
  }

  // Iterate through existing events
  for (const event of existingEvents) {
    const existingStartUTC = moment
      .tz(
        `${event.date} ${normalizeTime(event.startTime)}`,
        "YYYY-MM-DD HH:mm:ss",
        event.timeZone
      )
      .utc();
    const existingEndUTC = moment
      .tz(
        `${event.date} ${normalizeTime(event.endTime)}`,
        "YYYY-MM-DD HH:mm:ss",
        event.timeZone
      )
      .utc();

    // Check for invalid existing event dates
    if (!existingStartUTC.isValid() || !existingEndUTC.isValid()) {
      console.warn(`Invalid date/time for event ID ${event.title}`);
      continue;
    }

    // Check for overlap
    const hasTimeOverlap =
      newStartUTC.isSameOrBefore(existingEndUTC) &&
      newEndUTC.isSameOrAfter(existingStartUTC);

    // Check for 15-minute break rule
    const breakTime = moment(existingEndUTC).add(bufferTime, "minutes");
    const violatesBreakRule = newStartUTC.isSameOrBefore(breakTime);

    if (hasTimeOverlap || violatesBreakRule) {
      return {
        hasOverlap: true,
        conflictingEvent: {
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          date: event.date,
          timeZone: event.timeZone,
        },
        reason: hasTimeOverlap
          ? "Event overlaps with: " + event.title
          : `Insufficient break time (${bufferTime} minutes required)`,
      };
    }
  }

  return { hasOverlap: false };
}

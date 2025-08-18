import EventT from "@/types/event.type";
import moment from "moment-timezone";

export function checkTimeOverlap(newEvent: EventT, existingEvents: EventT[]) {
  // Use specified times for new event
  const newStartUTC = moment
    .tz(
      `${newEvent.date} ${newEvent.startTime}`,
      "YYYY-MM-DD HH:mm:ss",
      newEvent.timeZone
    )
    .utc();
  const newEndUTC = moment
    .tz(
      `${newEvent.date} ${newEvent.endTime}`,
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
        `${event.date} ${event.startTime}`,
        "YYYY-MM-DD HH:mm:ss",
        event.timeZone
      )
      .utc();
    const existingEndUTC = moment
      .tz(
        `${event.date} ${event.endTime}`,
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
    const hasOverlap =
      newStartUTC.isSameOrBefore(existingEndUTC) &&
      newEndUTC.isSameOrAfter(existingStartUTC);

    if (hasOverlap) {
      return {
        hasOverlap: true,
        conflictingEvent: {
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          date: event.date,
          timeZone: event.timeZone,
        },
      };
    }
  }

  return { hasOverlap: false };
}

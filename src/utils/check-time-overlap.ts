import EventT from "@/types/event.type";
import moment from "moment-timezone";

export function checkTimeOverlap(
  newEvent: EventT,
  existingEvents: EventT[],
  bufferTime: number
) {
  // Parse new event times as UTC
  const newStartUTC = moment.utc(
    `${newEvent.date} ${newEvent.startTime}`,
    "YYYY-MM-DD HH:mm:ss"
  );
  const newEndUTC = moment.utc(
    `${newEvent.date} ${newEvent.endTime}`,
    "YYYY-MM-DD HH:mm:ss"
  );

  // Validate new event times
  if (
    !newStartUTC.isValid() ||
    !newEndUTC.isValid() ||
    newStartUTC.isSameOrAfter(newEndUTC)
  ) {
    return {
      hasOverlap: false,
      error: "Invalid new event date or time",
      conflictingEvent: null,
      reason: "Invalid date or time format for new event",
    };
  }

  // Iterate through existing events
  for (const event of existingEvents) {
    // Parse existing event times as UTC
    const existingStartUTC = moment.utc(
      `${event.date} ${event.startTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    const existingEndUTC = moment.utc(
      `${event.date} ${event.endTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );

    // Skip invalid existing events
    if (!existingStartUTC.isValid() || !existingEndUTC.isValid()) {
      console.warn(`Invalid date/time for event: ${event.title}`);
      continue;
    }

    // Check for direct overlap
    const hasTimeOverlap =
      newStartUTC.isSameOrBefore(existingEndUTC) &&
      newEndUTC.isSameOrAfter(existingStartUTC);

    // Check buffer time (after existing event and before existing event)
    const bufferAfterExisting = moment(existingEndUTC).add(
      bufferTime,
      "minutes"
    );
    const bufferBeforeExisting = moment(existingStartUTC).subtract(
      bufferTime,
      "minutes"
    );
    const violatesBufferRule =
      newStartUTC.isSameOrBefore(bufferAfterExisting) &&
      newEndUTC.isSameOrAfter(bufferBeforeExisting);

    if (hasTimeOverlap || violatesBufferRule) {
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
          ? `Event overlaps with: ${event.title}`
          : `Insufficient buffer time (${bufferTime} minutes required)`,
        error: null,
      };
    }
  }

  return {
    hasOverlap: false,
    conflictingEvent: null,
    reason: null,
    error: null,
  };
}

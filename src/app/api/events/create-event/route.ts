import EventT from "@/types/event.type";
import { checkTimeOverlap } from "@/utils/check-time-overlap";
import { isWithinWorkingHours } from "@/utils/is-within-working-hours";
import { supabase } from "@/utils/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { body } = await req.json();
    const { endTime, startTime, ...values }: EventT = JSON.parse(body);

    const { data: settings } = await supabase
      .from("settings")
      .select("*")
      .single();

    // const { ...days } = JSON.parse(settings?.workingHoursConfiguration || "{}");

    const { maximumDailyHours, allowOverlappingEvents, bufferTime } =
      JSON.parse(settings?.eventConstraints || "{}");

    const { data } = await supabase
      .from("events")
      .select("*")
      .filter("date", "eq", values.date);

    const isOverLapWithTime = checkTimeOverlap(
      { ...values, startTime, endTime },
      data || [],
      bufferTime
    );

    const isMoreThanWorkingHour = isWithinWorkingHours(
      startTime,
      endTime,
      maximumDailyHours
    );

    if (isOverLapWithTime.hasOverlap && !allowOverlappingEvents) {
      return NextResponse.json(
        {
          error: isOverLapWithTime?.reason,
        },
        { status: 500 }
      );
    }

    if (!isMoreThanWorkingHour) {
      return NextResponse.json(
        { error: "Event is outside of working hours" },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from("events")
      .insert([{ ...values, endTime, startTime }]);

    if (error) throw new Error("Failed to create event");

    return NextResponse.json(
      { message: "Event created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import EventT from "@/types/event.type";
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

    const { maximumDailyHours } = JSON.parse(
      settings?.eventConstraints || "{}"
    );

    const { data } = await supabase
      .from("events")
      .select("*")
      .filter("date", "eq", values.date);

    function isWithinWorkingHours(
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

    const isMoreThanWorkingHour = isWithinWorkingHours(
      startTime,
      endTime,
      maximumDailyHours
    );

    if (data && data.length > 0) {
      return NextResponse.json(
        { error: "Event overlaps with: " + data[0].title },
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

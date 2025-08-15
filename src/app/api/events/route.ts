import { supabase } from "@/utils/supabase-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      throw new Error("Failed to fetch events");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

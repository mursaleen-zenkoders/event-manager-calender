import { Settings } from "@/types/settings";
import { supabase } from "@/utils/supabase-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      throw new Error("Failed to fetch settings");
    }

    return NextResponse.json(data as Settings, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

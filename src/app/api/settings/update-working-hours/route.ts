import { supabase } from "@/utils/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { body } = await req.json();
    const { workingHoursConfiguration, id } = JSON.parse(body);

    const { error } = await supabase
      .from("settings")
      .update({ workingHoursConfiguration })
      .eq("id", id);

    if (error) throw new Error("Failed to update settings");

    return NextResponse.json(
      { message: "Settings updated successfully" },
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

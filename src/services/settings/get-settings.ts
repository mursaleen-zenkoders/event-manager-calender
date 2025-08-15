import { Settings } from "@/types/settings";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../base-urls";

const getSettings = async () => {
  try {
    const response = await axios.get(URL.SETTINGS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.data;
    return data as Settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

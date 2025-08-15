import EventT from "@/types/event.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../base-urls";

const getEvents = async () => {
  try {
    const response = await axios.get(URL.EVENTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.data;
    return data as Array<EventT>;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });
}

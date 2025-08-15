import EventT from "@/types/event.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../base-urls";

const createEvent = async ({ ...event }: EventT) => {
  try {
    const response = await axios.post(URL.CREATE_EVENT, {
      body: JSON.stringify(event),
    });

    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    mutationKey: ["create-event"],
    onSuccess() {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

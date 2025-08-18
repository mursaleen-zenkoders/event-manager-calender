import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../base-urls";

interface UpdateWorkingHoursPayload {
  workingHoursConfiguration: string;
  id: number;
}

const updateWorkingHours = async ({
  workingHoursConfiguration,
  id,
}: UpdateWorkingHoursPayload) => {
  try {
    const response = await axios.patch(URL.UPDATE_WORKING_HOURS, {
      body: JSON.stringify({ workingHoursConfiguration, id }),
    });

    if (!response.status || response.status !== 200) {
      throw new Error("Failed to update Working Hours");
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error updating Working Hours:", error);
    throw error;
  }
};

export const useUpdateWorkingHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkingHours,
    mutationKey: ["update-working-hours"],
    onSuccess() {
      toast.success("Working Hours updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

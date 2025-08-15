import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../base-urls";

interface UpdateConstraintsPayload {
  eventConstraints: string;
  id: number;
}

const updateConstraints = async ({
  eventConstraints,
  id,
}: UpdateConstraintsPayload) => {
  try {
    const response = await axios.patch(URL.UPDATE_CONSTRAINTS, {
      body: JSON.stringify({ eventConstraints, id }),
    });

    if (!response.status || response.status !== 200) {
      throw new Error("Failed to update Constraints");
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error updating Constraints:", error);
    throw error;
  }
};

export const useUpdateConstraints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConstraints,
    mutationKey: ["update-constraints"],
    onSuccess() {
      toast.success("Constraints updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

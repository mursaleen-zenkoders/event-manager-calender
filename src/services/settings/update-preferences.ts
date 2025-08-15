import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../base-urls";

interface UpdatePreferencesPayload {
  timezone: string;
  id: number;
}

const updatePreferences = async ({
  id,
  timezone,
}: UpdatePreferencesPayload) => {
  try {
    const response = await axios.patch(URL.UPDATE_PREFERENCES, {
      body: JSON.stringify({ timezone, id }),
    });

    if (!response.status || response.status !== 200) {
      throw new Error("Failed to update preferences");
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,
    mutationKey: ["update-preferences"],
    onSuccess() {
      toast.success("Preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

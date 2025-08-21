"use client";

import { timezones } from "@/constants/time-zones";
import { useUpdatePreferences } from "@/services/settings/update-preferences";
import { useFormik } from "formik";
import { JSX } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import Select from "../select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface IProps {
  preferences: string;
  onClose: () => void;
  isPending: boolean;
  id: number;
}

export default function Preferences({
  preferences,
  isPending,
  onClose,
  id,
}: IProps): JSX.Element {
  const { mutateAsync } = useUpdatePreferences();

  const { values, setFieldValue, handleSubmit, dirty } = useFormik({
    initialValues: { timezone: preferences || "" },
    enableReinitialize: true,
    onSubmit: async ({ timezone }) => {
      try {
        await mutateAsync({ timezone, id });
        onClose();
      } catch (error) {
        console.log("🚀 ~ Preferences ~ error:", error);
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-x-2">
        <TbWorld /> <p>Preferences</p>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center h-10">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-1">
          <Label>Default Timezone</Label>
          <Select
            options={timezones}
            value={values.timezone}
            placeholder="Select Timezone"
            onChange={(value) => setFieldValue("timezone", value)}
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!dirty}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}

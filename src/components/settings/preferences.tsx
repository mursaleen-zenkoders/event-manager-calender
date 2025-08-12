import { timezones } from "@/constants/time-zones";
import { Settings } from "@/types/settings";
import { supabase } from "@/utils/supabase-client";
import { useFormik } from "formik";
import { JSX, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbWorld } from "react-icons/tb";
import Select from "../select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function Preferences({
  onClose,
  setSelectedTimezone,
}: {
  onClose: () => void;
  setSelectedTimezone: (timezone: string) => void;
}): JSX.Element {
  const [data, setData] = useState<
    Partial<Pick<Settings, "id" | "preferences">> | undefined
  >(undefined);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: { timezone: data?.preferences || timezones[0].value },
    enableReinitialize: true,
    onSubmit: async ({ timezone }) => {
      try {
        const { error } = await supabase
          .from("settings")
          .update({ preferences: timezone })
          .eq("id", data?.id ?? 1);

        if (error) return toast.error(error.message);

        setData({ id: data?.id ?? 1, preferences: timezone });
        toast.success("Settings saved successfully");
        onClose();
        setSelectedTimezone(timezone);
      } catch (error) {
        console.log("🚀 ~ Preferences ~ error:", error);
        toast.error("Something went wrong");
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();
      if (error) return toast.error(error.message);
      setData({ id: data?.id, preferences: data?.preferences });
    };
    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-x-2">
        <TbWorld /> <p>Preferences</p>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Default Timezone</Label>
        <Select
          options={timezones}
          value={values.timezone}
          placeholder="Select Timezone"
          onChange={(value) => setFieldValue("timezone", value)}
        />
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
}

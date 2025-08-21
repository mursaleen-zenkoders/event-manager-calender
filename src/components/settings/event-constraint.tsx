import { useUpdateConstraints } from "@/services/settings/update-constraints";
import { useFormik } from "formik";
import { LuShield } from "react-icons/lu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface IProps {
  eventConstraints: string | null;
  onClose: () => void;
  id: number;
}

const EventConstraint = ({ onClose, id, eventConstraints }: IProps) => {
  const { mutateAsync } = useUpdateConstraints();
  const { bufferTime, maximumDailyHours, allowOverlappingEvents } = JSON.parse(
    eventConstraints || "{}"
  );

  const {
    dirty,
    values,
    resetForm,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      bufferTime: bufferTime ?? 15,
      maximumDailyHours: maximumDailyHours ?? 8,
      allowOverlappingEvents: allowOverlappingEvents ?? false,
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      const eventConstraints = JSON.stringify(value);

      try {
        await mutateAsync({ eventConstraints, id });
        onClose();
      } catch (error) {
        console.log("🚀 ~ EventConstraint ~ error:", error);
      }
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-x-2">
        <LuShield /> <p>Event Constraints</p>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-y-1">
          <Label>Buffer Time Between Events (minutes)</Label>
          <Input
            type="number"
            name="bufferTime"
            onChange={handleChange}
            value={values.bufferTime}
            placeholder="Enter buffer time"
          />
          <p className="text-xs text-gray-600">
            Minimum time required between consecutive events
          </p>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Maximum Daily Hours</Label>
          <Input
            type="number"
            name="maximumDailyHours"
            onChange={handleChange}
            value={values.maximumDailyHours}
            placeholder="Enter maximum daily hours"
          />
          <p className="text-xs text-gray-600">
            Maximum hours of event allowed per day
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label
          htmlFor="allowOverlappingEvents"
          className="flex flex-col justify-start items-start"
        >
          <p>Allow Overlapping Events</p>
          <p className="text-sm text-gray-600">
            When enabled, events can overlap in time
          </p>
        </Label>
        <Switch
          id="allowOverlappingEvents"
          checked={values.allowOverlappingEvents}
          onCheckedChange={(v) => setFieldValue("allowOverlappingEvents", v)}
        />
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!dirty}>
          Save Settings
        </Button>
      </div>
    </form>
  );
};

export default EventConstraint;

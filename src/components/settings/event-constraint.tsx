import React from "react";
import { useFormik } from "formik";
import { LuShield } from "react-icons/lu";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const EventConstraint = ({ onClose }: { onClose: () => void }) => {
  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: {
      bufferTime: 15,
      maximumDailyHours: 8,
      allowOverlappingEvents: false,
    },
    onSubmit: () => {},
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
        <div>
          <p>Allow Overlapping Events</p>
          <p className="text-sm text-gray-600">
            When enabled, events can overlap in time
          </p>
        </div>
        <Switch
          type="button"
          onChange={handleChange}
          name="allowOverlappingEvents"
          checked={values.allowOverlappingEvents}
        />
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};

export default EventConstraint;

import { useFormik } from "formik";
import { FaRegClock } from "react-icons/fa";
import { LuShield } from "react-icons/lu";
import { TbWorld } from "react-icons/tb";
import TabsComponent from "./tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { TabsContent } from "./ui/tabs";

interface CalenderSettingsModalProps {
  onClose: () => void;
}

const CalenderSettingsModal = ({ onClose }: CalenderSettingsModalProps) => {
  return (
    <TabsComponent>
      <TabsContent value="tab1">{HoursConfiguration(onClose)}</TabsContent>
      <TabsContent value="tab2">{EventConstraint(onClose)}</TabsContent>
      <TabsContent value="tab3">{Preferences(onClose)}</TabsContent>
    </TabsComponent>
  );
};

export default CalenderSettingsModal;

const HoursConfiguration = (onClose: () => void) => {
  return (
    <form className="flex flex-col gap-3">
      <div className="flex items-center gap-x-2">
        <FaRegClock /> <p>Working Hours Configuration</p>
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};

const EventConstraint = (onClose: () => void) => {
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

const Preferences = (onClose: () => void) => {
  return (
    <form className="flex flex-col gap-3">
      <div className="flex items-center gap-x-2">
        <TbWorld /> <p>Preferences</p>
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  );
};

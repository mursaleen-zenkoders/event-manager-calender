"use client";

import { FaRegClock } from "react-icons/fa";
import EventConstraint from "./settings/event-constraint";
import Preferences from "./settings/preferences";
import TabsComponent from "./tabs";
import { Button } from "./ui/button";
import { TabsContent } from "./ui/tabs";

interface CalenderSettingsModalProps {
  onClose: () => void;
  setSelectedTimezone: (timezone: string) => void;
}

const CalenderSettingsModal = ({
  onClose,
  setSelectedTimezone,
}: CalenderSettingsModalProps) => {
  return (
    <TabsComponent>
      <TabsContent value="tab1">{HoursConfiguration(onClose)}</TabsContent>
      <TabsContent value="tab2">
        <EventConstraint onClose={onClose} />
      </TabsContent>
      <TabsContent value="tab3">
        <Preferences
          onClose={onClose}
          setSelectedTimezone={setSelectedTimezone}
        />
      </TabsContent>
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

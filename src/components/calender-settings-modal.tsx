"use client";

import { useSettings } from "@/services/settings/get-settings";
import EventConstraint from "./settings/event-constraint";
import HoursConfiguration from "./settings/hours-configuration";
import Preferences from "./settings/preferences";
import TabsComponent from "./tabs";
import { TabsContent } from "./ui/tabs";

interface CalenderSettingsModalProps {
  onClose: () => void;
}

const CalenderSettingsModal = ({ onClose }: CalenderSettingsModalProps) => {
  const { data, isPending } = useSettings();

  const { eventConstraints, id, preferences, workingHoursConfiguration } =
    data || {
      id: 1,
      preferences: "",
      eventConstraints: "[]",
      workingHoursConfiguration: "[]",
    };

  return (
    <TabsComponent>
      <TabsContent value="tab1">
        <HoursConfiguration
          id={id}
          onClose={onClose}
          workingHoursConfiguration={workingHoursConfiguration}
        />
      </TabsContent>
      <TabsContent value="tab2">
        <EventConstraint
          eventConstraints={eventConstraints}
          onClose={onClose}
          id={id}
        />
      </TabsContent>
      <TabsContent value="tab3">
        <Preferences
          id={id}
          onClose={onClose}
          isPending={isPending}
          preferences={preferences}
        />
      </TabsContent>
    </TabsComponent>
  );
};

export default CalenderSettingsModal;

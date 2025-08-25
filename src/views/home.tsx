"use client";

import CalenderSettingsModal from "@/components/calender-settings-modal";
import CreateEvent from "@/components/create-event";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import EventT from "@/types/event.type";
import { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useGetEvents } from "@/services/events/get-events";
import { useSettings } from "@/services/settings/get-settings";
import formatEventTime from "@/utils/time-formater";
import moment from "moment-timezone";
import { FaSpinner } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const { data: { preferences } = { preferences: "UTC" } } = useSettings();

  const { data: events, isPending } = useGetEvents();

  const localizer = useMemo(() => {
    moment.tz.setDefault(preferences);
    return momentLocalizer(moment);
  }, [preferences]);

  const calendarEvents = useMemo(
    () => events?.map((item) => formatEventTime(item, preferences)),
    [events, preferences]
  );

  return (
    <div className="flex flex-col gap-y-3 p-6">
      <div className="flex justify-between items-center relative">
        <h1 className="text-3xl font-semibold">Dynamic Calender</h1>

        <Button
          variant={"outline"}
          className="flex items-center gap-x-1"
          onClick={() => setIsOpenSettings(true)}
        >
          <LuSettings />
          Setting
        </Button>

        <Button
          onClick={() => setIsOpen(true)}
          className="absolute -bottom-12 right-0 cursor-pointer z-50"
        >
          Add Event
        </Button>
      </div>

      <div className="relative">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
          views={["week"]}
          showMultiDayTimes={true}
          view="week"
          components={{ event: EventWrapper }}
          className="!flex !items-start !justify-between !relative"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              border: "none",
            },
          })}
        />
        {/* Loader overlay */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Event">
        <CreateEvent onClose={() => setIsOpen(false)} />
      </Modal>

      <Modal
        isOpen={isOpenSettings}
        title="Calender Settings"
        onClose={() => setIsOpenSettings(false)}
      >
        <CalenderSettingsModal onClose={() => setIsOpenSettings(false)} />
      </Modal>
    </div>
  );
}

const EventWrapper = ({
  event,
}: {
  event: Partial<EventT & { start: Date; end: Date }>;
}) => {
  return (
    <div className="flex flex-col gap-y-1 h-full p-1 !text-white">
      <h1 className="font-medium text-sm line-clamp-1 min-h-4">
        {event.title}
      </h1>
      <div className="flex gap-x-1 text-[13px]">
        <p>{moment(event.start).format("h:mm A")}</p>
        <span>-</span>
        <p>{moment(event.end).format("h:mm A")}</p>
      </div>
    </div>
  );
};

"use client";

import CreateEvent from "@/components/create-event";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import EventT from "@/types/event.type";
import { supabase } from "@/utils/supabase-client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs);
dayjs.extend(utc);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<Array<EventT>>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.log("🚀 ~ fetchTodos ~ error:", error);
      } else setEvents(data);
    };
    fetchTodos();
  }, [isOpen]);

  const CalenderData = events.map(
    ({ color, title, startTime, endTime, date }) => ({
      title,
      color,
      end: dayjs.utc(`${date}T${endTime}`).toDate(),
      start: dayjs.utc(`${date}T${startTime}`).toDate(),
    })
  );

  return (
    <div className="flex flex-col gap-y-3 p-6">
      <div className="flex justify-between items-center relative">
        <h1 className="text-3xl font-semibold">Dynamic Calender</h1>

        <Button variant={"outline"}>Setting</Button>

        <Button
          onClick={() => setIsOpen(true)}
          className="absolute -bottom-12 right-0 cursor-pointer z-50"
        >
          Add Event
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={CalenderData}
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateEvent onClose={() => setIsOpen(false)} />
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
      <h1 className="font-medium text-sm">{event.title}</h1>
      <div className="flex gap-x-1 text-sm">
        <p>{dayjs(event.start).format("h:mm A")}</p>
        <span>-</span>
        <p>{dayjs(event.end).format("h:mm A")}</p>
      </div>
    </div>
  );
};

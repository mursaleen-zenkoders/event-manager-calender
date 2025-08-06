"use client";
import CreateEvent from "@/components/create-event";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs);

export default function Home() {
  return (
    <div className="flex flex-col gap-y-3 p-6">
      <div className="flex justify-between items-center relative">
        <h1 className="text-3xl font-semibold">Dynamic Calender</h1>

        <Modal
          title="Create Event"
          trigger={<Button variant={"outline"}>Setting</Button>}
        >
          <div>Setting</div>
        </Modal>

        <Modal
          title="Create Event"
          trigger={
            <Button className="absolute -bottom-12 right-0 cursor-pointer z-50">
              Add Event
            </Button>
          }
        >
          <CreateEvent />
        </Modal>
      </div>

      <Calendar
        localizer={localizer}
        events={[
          {
            title: "Lorem",
            start: new Date(),
            end: new Date(),
            color: "#00bc7d",
          },
        ]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={["month"]}
        view="month"
        // toolbar={false}
        components={{
          eventWrapper: ({ event }) => (
            <div
              className={`flex flex-col gap-y-1`}
              style={{ backgroundColor: event.color }}
            >
              <h1>{event.title}</h1>
              <div className="flex gap-x-2">
                <p>{dayjs(event?.start).format("h:mm A")}</p> -
                <p>{dayjs(event?.end).format("h:mm A")}</p>
              </div>
            </div>
          ),
        }}
        className="!flex !items-start !justify-between !relative"
      />
    </div>
  );
}

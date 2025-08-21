"use client";

import { colors } from "@/constants/colors";
import { timezones } from "@/constants/time-zones";
import { createEventSchema } from "@/schemas/create-event.schema";
import { useCreateEvent } from "@/services/events/post-create-event";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import Select from "./select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CreateEvent = ({ onClose }: { onClose: () => void }) => {
  const [AvailabilityError, setAvailabilityError] = useState<
    string | undefined
  >(undefined);

  const { mutateAsync } = useCreateEvent();

  const {
    dirty,
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      date: "",
      title: "",
      endTime: "",
      timeZone: "",
      startTime: "",
      description: "",
      isAllDay: false,
      color: colors[0],
    },
    validationSchema: createEventSchema,
    onSubmit: async (values) => {
      setAvailabilityError(undefined);
      try {
        await mutateAsync(values);
        onClose();
      } catch (error: AxiosError<{ error: string }> | unknown) {
        if (error) {
          setAvailabilityError(
            (error as AxiosError<{ error: string }>)?.response?.data?.error
          );
        } else {
          setAvailabilityError("An unexpected error occurred.");
        }
      }
    },
  });

  const error = (name: keyof typeof values) => {
    if (errors[name] && touched[name]) {
      return <p className="text-red-500 text-sm">{errors[name]}</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1">
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter event title"
        />
        {error("title")}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Description</Label>
        <Input
          type="text"
          name="description"
          onChange={handleChange}
          value={values.description}
          placeholder="Enter event description"
        />
        {error("description")}
      </div>

      {/* Date and Time */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-y-1">
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            onChange={handleChange}
            value={values.date}
            min={new Date().toISOString().split("T")[0]}
          />
          {error("date")}
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Start Time</Label>
          <Input
            type="time"
            name="startTime"
            onChange={handleChange}
            value={values.startTime}
          />
          {error("startTime")}
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>End Time</Label>
          <Input
            type="time"
            name="endTime"
            onChange={handleChange}
            value={values.endTime}
          />
          {error("endTime")}
        </div>
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-y-1">
        <Label>Event Color</Label>
        <div className="flex items-center gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              style={{ backgroundColor: color }}
              onClick={() => setFieldValue("color", color)}
              className={`w-6 h-6 rounded-full cursor-pointer ${
                values.color === color && "border-2 border-primary"
              }`}
            />
          ))}
        </div>
        {error("color")}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Timezone</Label>
        <Select
          options={timezones}
          value={values.timeZone}
          placeholder="Select Timezone"
          onChange={(value) => setFieldValue("timeZone", value)}
        />
        {error("timeZone")}
      </div>

      {/* All Day */}
      <div className="flex gap-2 items-center">
        <Input
          type="checkbox"
          name="isAllDay"
          className="w-4 h-4"
          onChange={handleChange}
          checked={values.isAllDay}
        />
        <Label>Recurring Event</Label>
      </div>

      <p className="text-red-500 text-sm">{AvailabilityError}</p>

      <div className="flex items-center justify-start gap-x-3">
        <Button type="submit" disabled={!dirty}>
          Create Event
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateEvent;

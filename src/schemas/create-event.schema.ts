import { colors } from "@/constants/colors";
import * as yup from "yup";

export const createEventSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup.string().optional(),
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!value || !startTime) return true;
        return value > startTime;
      }
    )
    .test(
      "min-30-min-diff",
      "End time must be at least 30 minutes after start time",
      function (endTime) {
        const { startTime } = this.parent;
        if (!endTime || !startTime) return true;

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        return endTotal - startTotal >= 30;
      }
    ),
  timeZone: yup.string().required("Timezone is required"),
  color: yup
    .string()
    .required("Color is required")
    .oneOf(colors, "Invalid color selection"),
  isAllDay: yup.boolean().default(false),
});

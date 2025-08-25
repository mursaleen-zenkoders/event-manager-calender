import { useUpdateWorkingHours } from "@/services/settings/update-working-hours";
import { useFormik } from "formik";
import { FaRegClock } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface IProps {
  workingHoursConfiguration: string | null;
  onClose: () => void;
  id: number;
}

export type TimeSlotT = {
  from: string;
  to: string;
};

type initialValuesT = {
  Monday: Array<TimeSlotT>;
  Tuesday: Array<TimeSlotT>;
  Wednesday: Array<TimeSlotT>;
  Thursday: Array<TimeSlotT>;
  Friday: Array<TimeSlotT>;
  Saturday: Array<TimeSlotT>;
  Sunday: Array<TimeSlotT>;
};

const initialTime: TimeSlotT = { from: "09:00", to: "17:00" };

const HoursConfiguration = ({
  workingHoursConfiguration,
  onClose,
  id,
}: IProps) => {
  const { mutateAsync } = useUpdateWorkingHours();

  const { values, handleChange, setFieldValue, handleSubmit, setValues } =
    useFormik<initialValuesT>({
      initialValues: workingHoursConfiguration
        ? JSON.parse(workingHoursConfiguration || "{}")
        : {
            Monday: [initialTime],
            Tuesday: [initialTime],
            Wednesday: [initialTime],
            Thursday: [initialTime],
            Friday: [initialTime],
            Saturday: [],
            Sunday: [],
          },
      enableReinitialize: true,
      onSubmit: async (values) => {
        try {
          await mutateAsync({
            workingHoursConfiguration: JSON.stringify(values),
            id,
          });
          onClose();
        } catch (error) {
          console.error(error);
        }
      },
    });

  const handleAddSlot = (key: keyof typeof values) => {
    setFieldValue(key, [...values[key], initialTime]);
  };

  const handleRemove = (key: keyof typeof values, i: number) => {
    const updatedSlots = values[key].filter((_, index) => index !== i);
    setFieldValue(key, updatedSlots);
  };

  const handleCopyToAll = (key: keyof initialValuesT) => {
    const value = values[key];
    setValues({
      ...values,
      Monday: value,
      Tuesday: value,
      Wednesday: value,
      Thursday: value,
      Friday: value,
      Saturday: value,
      Sunday: value,
    });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <FaRegClock /> <p>Working Hours Configuration</p>
      </div>

      <div className="flex flex-col gap-y-5 max-h-[40dvh] overflow-y-auto">
        {Object.entries(values).map(([key, value]) => (
          <div className="flex flex-col gap-y-3 pb-2" key={key}>
            <div className="flex items-center w-full gap-x-2 justify-between">
              <p className="font-semibold text-xl">{key}</p>
              <div className="flex gap-x-2">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => handleAddSlot(key as keyof initialValuesT)}
                >
                  Add Slot
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => handleCopyToAll(key as keyof initialValuesT)}
                >
                  Copy to All
                </Button>
              </div>
            </div>

            {value.length > 0 ? (
              <div className="flex flex-col gap-y-3">
                {value.map(({ from, to }, i) => (
                  <div key={i} className="flex items-center gap-x-3">
                    <Input
                      type="time"
                      value={from}
                      onChange={handleChange}
                      name={`${key}.${i}.from`}
                      className="bg-gray-200/60"
                    />
                    <Input
                      value={to}
                      type="time"
                      name={`${key}.${i}.to`}
                      onChange={handleChange}
                      className="bg-gray-200/60"
                    />

                    <Button
                      type="button"
                      className="bg-red-600"
                      onClick={() =>
                        handleRemove(key as keyof initialValuesT, i)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              "No working hours set"
            )}
          </div>
        ))}
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

export default HoursConfiguration;

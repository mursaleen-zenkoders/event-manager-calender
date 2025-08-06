import { useFormik } from "formik";
import { Input } from "./ui/input";

const colors = [
  "#3c82f6",
  "#ef4444",
  "#12b981",
  "#f59e0c",
  "#8b5cf6",
  "#ec4899",
  "#84cc15",
  "#06b6d4",
];

const CreateEvent = () => {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      date: "",
      title: "",
      endTime: "",
      timeZone: "",
      startTime: "",
      description: "",
      color: colors[0],
    },
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <Input
        type="text"
        name="title"
        value={values.title}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="description"
        onChange={handleChange}
        value={values.description}
      />
    </form>
  );
};

export default CreateEvent;

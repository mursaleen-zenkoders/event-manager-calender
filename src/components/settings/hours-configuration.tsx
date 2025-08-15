import { FaRegClock } from "react-icons/fa";
import { Button } from "../ui/button";

interface IProps {
  workingHoursConfiguration: string | null;
  onClose: () => void;
  id: number;
}

const HoursConfiguration = ({ onClose }: IProps) => {
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

export default HoursConfiguration;

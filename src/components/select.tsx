import {
  Select as SelectCom,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Select = ({ options, placeholder, value, onChange }: IProps) => {
  return (
    <SelectCom value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[180px] w-full">
        <SelectValue placeholder={value || placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectCom>
  );
};

export default Select;

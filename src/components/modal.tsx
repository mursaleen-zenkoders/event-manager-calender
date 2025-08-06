import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IProps {
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function Modal({ title, isOpen, onClose, trigger, children }: IProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

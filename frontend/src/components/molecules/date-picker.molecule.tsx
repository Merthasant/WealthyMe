import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  formatDate?: string;
  value?: Date | string;
  onChange?: (date: Date | string | undefined) => void;
}

export default function DatePicker({
  label = "Date",
  formatDate = "PPP",
  value,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const dateValue = value
    ? typeof value === "string"
      ? new Date(value)
      : value
    : undefined;

  return (
    <Field>
      <FieldLabel htmlFor="date-picker-optional">{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-optional"
            className="w-32 justify-between font-normal"
          >
            {dateValue
              ? format(dateValue, formatDate)
              : `Select ${label.toLowerCase()} `}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            captionLayout="dropdown"
            defaultMonth={dateValue}
            onSelect={(date) => {
              onChange?.(date ? date.toISOString() : undefined);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

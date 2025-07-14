import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      label = "Date",
      placeholder = "Select date",
      className = "",
      ...inputProps
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState(value);
    const [inputValue, setInputValue] = React.useState(formatDate(value));

    React.useEffect(() => {
      setInputValue(formatDate(value));
      setMonth(value);
    }, [value]);

    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {label && (
          <Label htmlFor="date-picker-input" className="px-1">
            {label}
          </Label>
        )}
        <div className="relative flex gap-2">
          <Input
            id="date-picker-input"
            ref={ref}
            value={inputValue}
            placeholder={placeholder}
            className="bg-background pr-10"
            onChange={(e) => {
              setInputValue(e.target.value);
              const d = new Date(e.target.value);
              if (isValidDate(d)) {
                onChange?.(d);
                setMonth(d);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
            {...inputProps}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                tabIndex={-1}
                type="button"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  onChange?.(date);
                  setInputValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;

"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  const selectedLabels = selected
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean); // Remove undefined values

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selected.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : selected.length <= 2 ? (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary" className="mr-1">
                  {label}
                </Badge>
              ))
            ) : (
              <>
                <Badge variant="secondary">{selectedLabels[0]}</Badge>
                <Badge variant="secondary">+{selected.length - 1} more</Badge>
              </>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px] max-h-[300px] overflow-y-auto">
        <DropdownMenuCheckboxItem
          checked={selected.length === options.length}
          onCheckedChange={handleSelectAll}
          className="font-medium"
        >
          Select All
        </DropdownMenuCheckboxItem>
        <div className="border-t my-1" />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

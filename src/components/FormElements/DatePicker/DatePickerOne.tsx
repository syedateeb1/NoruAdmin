"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef, useState } from "react";

interface DatePickerOneProps {
  label: string;
  name: string;
  value: Date | null; // Accept Date object or null
  onChange: (date: Date) => void;
  error?: string; // Optional error message
}

const DatePickerOne = ({ label, name, value, onChange, error }: DatePickerOneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpInstance = useRef<flatpickr.Instance | null>(null);
  const [internalValue, setInternalValue] = useState<string | null>(value ? flatpickr.formatDate(value, "M j, Y") : null);

  useEffect(() => {
    if (inputRef.current) {
      // Initialize flatpickr if not already initialized
      if (!fpInstance.current) {
        fpInstance.current = flatpickr(inputRef.current, {
          mode: "single",
          static: true,
          monthSelectorType: "static",
          dateFormat: "M j, Y", // Display format
          onChange: (selectedDates, dateStr, instance) => {
            if (selectedDates[0]) {
              setInternalValue(dateStr);
              onChange(selectedDates[0]); // Call onChange with Date object
            }
          },
          onReady: (selectedDates, dateStr, instance) => {
            if (value && !selectedDates.length) {
              instance.setDate(value, true); // Set initial value if provided
            }
          },
        });
      } else {
        // Update the date if value changes externally
        if (value && fpInstance.current) {
          fpInstance.current.setDate(value, true);
          setInternalValue(flatpickr.formatDate(value, "M j, Y"));
        }
      }
    }

    // Cleanup flatpickr instance on unmount
    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
        fpInstance.current = null;
      }
    };
  }, [value, onChange]);

  // Update internal value when value prop changes
  useEffect(() => {
    if (value && internalValue !== flatpickr.formatDate(value, "M j, Y")) {
      setInternalValue(flatpickr.formatDate(value, "M j, Y"));
    }
  }, [value, internalValue]);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          className={`form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${error ? "border-red-500" : ""
            }`}
          placeholder="mm/dd/yyyy"
          value={internalValue || ""}
          readOnly // Prevent manual input to ensure flatpickr control
          data-class="flatpickr-right"
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default DatePickerOne;
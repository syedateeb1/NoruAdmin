"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId } from "react";

type Option = { value: string; label: string };

type PropsType = {
  label: string;
  items: Option[];
  value?: string; // ✅ Added for controlled behavior
  prefixIcon?: React.ReactNode;
  className?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
};

export function Select({
  items,
  label,
  value,
  placeholder,
  prefixIcon,
  className,
  onChange,
  name,
  error,
}: PropsType) {
  const id = useId();

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">{prefixIcon}</div>
        )}

        <select
          id={id}
          name={name}
          value={value || ""} // ✅ Controlled value
          onChange={onChange} // ✅ Direct onChange handler
          className={cn(
            "w-full appearance-none rounded-lg border px-5.5 py-3 outline-none transition focus:border-primary dark:bg-dark-2",
            "bg-transparent text-dark placeholder:text-dark-5 dark:text-white dark:[&>option]:text-dark-6 dark:border-dark-3 dark:focus:border-primary",
            prefixIcon && "pl-11.5",
            value ? "text-dark dark:text-white" : "text-dark-5",
            error
              ? "border-red focus:border-red dark:border-red dark:focus:border-red"
              : "border-stroke",
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
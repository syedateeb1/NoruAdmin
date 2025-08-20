import { cn } from "@/lib/utils";
import { useId } from "react";

interface PropsType {
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  icon?: React.ReactNode;
  defaultValue?: string;
  name?: string;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string; // ✅ new error prop
}

export function TextAreaGroup({
  label,
  placeholder,
  required,
  disabled,
  active,
  className,
  icon,
  defaultValue,
  name,
  value,
  handleChange,
  error,
}: PropsType) {
  const id = useId();

  return (
    <div className={cn(className)}>
      <label
        htmlFor={id}
        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="relative mt-3 [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-5.5 [&_svg]:top-5.5">
        <textarea
          id={id}
          name={name}
          rows={6}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full rounded-lg border-[1.5px] bg-transparent px-5.5 py-3 text-dark outline-none transition disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:disabled:bg-dark",
            icon && "py-5 pl-13 pr-5",
            error
              ? "border-red focus:border-red dark:border-red dark:focus:border-red"
              : "border-stroke focus:border-primary dark:focus:border-primary",
          )}
          required={required}
          disabled={disabled}
          data-active={active}
        />

        {icon}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

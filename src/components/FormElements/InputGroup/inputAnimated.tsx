"use client";

import { cn } from "@/lib/utils";
import { type HTMLInputTypeAttribute, useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👈 Replace with your icon set if needed

type InputGroupProps = {
    label: string;
    icon?: React.ReactNode;
    name?: string;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: HTMLInputTypeAttribute;
    error?: string;
    required?: boolean;
    className?: string; // ✅ now accepted
};

const InputGroupAnimated: React.FC<InputGroupProps> = ({
    label,
    icon,
    name,
    value,
    onChange,
    placeholder = " ",
    type = "text",
    error,
    required = false,
    className,
}) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFloating, setIsFloating] = useState(
        !!(value && value.length > 0)
    );

    useEffect(() => {

        setIsFloating(true);

    }, []);


    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const autoComplete = isPassword ? "new-password" : "off";

    return (
        <div className={cn("relative w-full", className)}>
            <input
                id={id}
                name={name}
                type={inputType}
                ref={inputRef}
                value={value}
                onChange={(e) => {
                    onChange?.(e);
                    setIsFloating(e.target.value.length > 0);
                }}
                autoComplete={autoComplete}

                placeholder=" "
                className={cn(
                    "peer w-full rounded-md border border-gray-300 pl-14 pr-11 pt-[18px] pb-[6px] text-sm text-gray-900 bg-transparent placeholder-transparent",
                    "focus:border-[#7b61ff] focus:ring-0 focus:outline-none",
                    "disabled:bg-gray-100 disabled:cursor-not-allowed",
                    error && "border-red-500 focus:border-red-500"
                )}
            />

            {/* Floating Label */}
            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute bg-white p-1 left-14 top-[14px] text-sm text-gray-500 transition-all duration-200",
                    "peer-placeholder-shown:top-[8px] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400",
                    "peer-focus:top-[-6px]  peer-focus:text-xs peer-focus:text-[#7b61ff]",
                    isFloating && "top-[-6px] text-xs text-[#7b61ff]"
                )}
            >
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>

            {/* Left Icon Inside Input */}
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    {icon}
                </div>
            )}
            {/* Password Toggle Icon on Right */}
            {isPassword && (
                <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </div>
            )}

            {/* Optional Error Message */}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputGroupAnimated;

"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useCallback, useState } from "react";
import InputGroupAnimated from "../FormElements/InputGroup/inputAnimated";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";
import Swal from "sweetalert2";

interface FormData {
    email: string;
    password: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const DeleteWithPassword: React.FC = () => {
    const { login } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    // Handle input changes
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for the field
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }, []);

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        // Required fields
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        // Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Password length
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;
        // Show confirmation popup
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete your account!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;
        setLoading(true);
        setErrors((prev) => ({ ...prev, general: undefined }));

        try {
            const result = await loginUser({
                email: formData.email,
                password: formData.password,
                user_type: "Customer"
            });

            login({ user: result.data, token: result.data.token });
            router.push("/");
        } catch (err: any) {
            const apiError = err as ApiError;
            const errorMessage = apiError?.response?.data?.message || "Failed to sign in. Please try again.";
            setErrors((prev) => ({ ...prev, general: errorMessage }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-label="Sign in form">
            <InputGroupAnimated
                type="email"
                label="Email"
                className="mb-5 [&_input]:py-[15px]"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                icon={<EmailIcon />}
                error={errors.email}
            />
            <InputGroupAnimated
                type="password"
                label="Password"
                className="mb-5 [&_input]:py-[15px]"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                icon={<PasswordIcon />}
                error={errors.password}
            />

            {errors.general && (
                <p className="text-center text-sm text-red-500">{errors.general}</p>
            )}

            <div className="mb-4.5">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign In"}
                    {loading && (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default DeleteWithPassword;

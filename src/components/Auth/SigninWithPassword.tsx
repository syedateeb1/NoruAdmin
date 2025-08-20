"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";
import InputGroupAnimated from "../FormElements/InputGroup/inputAnimated";
// Define interface for form data
interface FormData {
  email: string;
  password: string;
}
// Define interface for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const SigninWithPassword: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  // Memoize handleInputChange to prevent unnecessary re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const result = await loginUser({ email: formData.email, password: formData.password, user_type: "Customer" });
      login({ user: result.data, token: result.data.token }); // ✅
      router.push("/");
    } catch (err: any) {
      const apiError = err as ApiError;
      console.log(err, "errorlogging in");
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
      />

      {/* <InputGroup
          type="password"
          label="Password"
          className="mb-5 [&_input]:py-[15px]"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          icon={<PasswordIcon />}
        /> */}

      {/* <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) => setData((prev) => ({ ...prev, remember: e.target.checked }))}
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div> */}

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
}
export default React.memo(SigninWithPassword);
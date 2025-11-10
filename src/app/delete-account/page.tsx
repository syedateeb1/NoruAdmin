"use client";
import DeleteWithPassword from "@/components/Auth/DeleteAccountVerify";
import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Sign in",
// };

export default function SignIn() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/"); // Redirect to private home page if logged in
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div className="h-screen w-full flex">
        {/* Left side with image and logo */}
        <div className="w-1/2 relative hidden md:flex items-center justify-center bg-black">
          {/* <Image
            src="/images/login-bg.png" // Replace with your actual image path
            alt="Login Background"
            layout="fill"
            objectFit="cover"
            className="opacity-70"
          /> */}
          <div className="absolute z-10 text-white text-center px-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-yellow-400 rounded p-2">
                <span className="text-black font-bold text-3xl">N</span>
              </div>
            </div>
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
            <p className="text-sm mt-2">Manage your platform efficiently</p>
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-3xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-black">Delete Your Account</h2>
            <p className="text-sm text-black text-center mb-6">
              Verify your identity to delete your account
            </p>
            <DeleteWithPassword />
          </div>
        </div>
      </div>
    </>
  );
}

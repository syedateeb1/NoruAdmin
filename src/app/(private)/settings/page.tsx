import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { UpdateSettingForm, } from "./_components/upload-photo";
import { UpdateRadiusForm } from "./_components/update-radius";

export const metadata: Metadata = {
  title: "Settings Page",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px] pt-10 px-4 md:px-2  gap-1 flex flex-col">


      <UpdateRadiusForm />
      <UpdateSettingForm />


    </div>
  );
};


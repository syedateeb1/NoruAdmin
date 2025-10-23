"use client"
import { UploadIcon, UserIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { setRadiusService, settings } from "@/services/settingService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function UpdateRadiusForm() {
    const [radius, setRadius] = useState<string>("0.0");
    const [loading, setLoading] = useState(true);


    // ✅ Handle save
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ radius });
        if (parseInt(radius) < 1) {
            toast.error("Radius must be 1 or greater");
            return;
        }

        try {
            const res = await setRadiusService({ radius });
            // const res = { success: true, data: { radius: "0.0", photo: "/users/placeholder.png" } };
            if (res?.status === 200) {
                toast.success("Radius set successfully!");

            } else {
                toast.error("Failed to set Radius");
            }
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Error setting Radius");
        }
    };

    // ✅ Load existing profile on component mount
    const loadRadius = async () => {
        try {
            const res = await setRadiusService();
            console.log(res?.data, "radius")
            if (res?.data) {
                setRadius(res.data.immediate_ride_radius || "");

            }
        } catch (err) {
            console.error("Error loading profile:", err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRadius();
    }, []);




    return (
        <ShowcaseSection title="Settings" className="w-full mx-auto pt-10">
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col items-start gap-3">
                    <InputGroup
                        className="w-full md:w-1/2 "
                        type="number"
                        name="radius"
                        label="Radius:"
                        placeholder="3.175"
                        defaultValue={radius}
                        handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(e.target.value)}
                        // icon={<UserIcon />}
                        iconPosition="left"
                        height="sm"
                        min={1} // ✅ minimum value 1

                    />

                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </ShowcaseSection>
    );
}

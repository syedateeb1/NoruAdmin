"use client"
import { UploadIcon, UserIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { settings } from "@/services/settingService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function UpdateSettingForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<{ title?: string; description?: string; photo?: string }>({});

  // ✅ Load existing profile on component mount
  const loadProfile = async () => {
    try {
      const res = await settings();
      console.log(res?.data)
      if (res?.data) {
        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setPhotoPreview(res.data.image_url || "/users/placeholder.png");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ✅ Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, photo: undefined })); // Clear photo error

    }
  };
  const validate = () => {
    const newErrors: { title?: string; description?: string; photo?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!photoFile && !photoPreview) newErrors.photo = "Photo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (photoFile) formData.append("image", photoFile);

    try {
      const res = await settings(formData);
      // const res = { success: true, data: { radius: "0.0", photo: "/users/placeholder.png" } };
      if (res?.status === 200) {
        toast.success(res?.message || "Setting updated successfully!");
        loadProfile();
      } else {
        toast.error("Failed to update setting");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Error saving settings");
    }
  };



  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      {/* <div className="mb-4 grid grid-cols-1 md:grid-cols-2 items-start gap-3">
        <span className="flex flex-col gap-1">

          <InputGroup
            className="w-full  "
            type="text"
            name="title"
            label="Title:"
            placeholder="Title Enter here"
            defaultValue={title}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            // icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </span>
        <span className="flex flex-col gap-1">

          <InputGroup
            className="w-full "
            type="text"
            name="description"
            label="Description:"
            placeholder="description Enter here"
            defaultValue={description}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            // icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

        </span>
      </div> */}
      <div className="mb-4 flex flex-col items-start gap-3">
        <label
          htmlFor={"bgImg"}
          className="text-body-sm font-medium text-dark dark:text-white"
        >
          Upload Background Image:
        </label>
        {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}

      </div>

      {/* Upload Section */}
      <div className="w-full h-full min-h-[400px] border border-dashed border-gray-300 rounded-xl bg-gray-100 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary flex flex-col items-center justify-center transition-all relative overflow-hidden">
        <input
          type="file"
          name="bgImg"
          id="bgImg"
          accept="image/png, image/jpg, image/jpeg"
          hidden
          onChange={handleFileChange}
        />

        <label
          htmlFor="bgImg"
          className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-center p-4"
        >
          {photoPreview ? (
            <div className="relative w-full h-full">
              <Image
                src={photoPreview}
                alt="bgImg"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-lg">
                  Change Photo
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                <UploadIcon />
              </div>
              <p className="mt-2 text-body-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-body-xs">PNG, JPG, JPEG (max 800x800px)</p>
            </div>
          )}
        </label>
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
  );
}

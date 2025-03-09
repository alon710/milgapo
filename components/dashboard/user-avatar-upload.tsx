"use client";

import { User } from "@supabase/supabase-js";
import { CameraIcon, Loader2, Trash2Icon, UploadIcon, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface UserAvatarUploadProps {
    currentUrl: string | null;
    onUploadComplete: (url: string | null) => void;
    user: User;
}

export function UserAvatarUpload({ currentUrl, onUploadComplete, user }: UserAvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        setIsUploading(true);
        setImageError(false);

        try {
            const supabase = createClient();

            // Create a unique file name
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload the file
            const { error } = await supabase.storage.from("user-uploads").upload(filePath, file, {
                upsert: true,
                contentType: file.type
            });

            if (error) {
                throw error;
            }

            // Get the public URL
            const {
                data: { publicUrl }
            } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

            // Update state with the new URL
            onUploadComplete(publicUrl);
            toast.success("Profile image uploaded successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            setImageError(true);
        } finally {
            setIsUploading(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = async () => {
        if (!currentUrl) return;

        setIsDeleting(true);
        try {
            // Extract the file path from the URL
            const urlParts = currentUrl.split("/");
            const filePath = urlParts.slice(urlParts.indexOf("user-uploads") + 1).join("/");

            if (filePath) {
                const supabase = createClient();
                // Delete the file from storage
                await supabase.storage.from("user-uploads").remove([filePath]);
            }

            // Update state
            onUploadComplete(null);
            setImageError(false);
            toast.success("Profile image removed");
        } catch (error) {
            console.error("Error removing image:", error);
            toast.error("Failed to remove image");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Avatar Preview */}
            <div className="relative h-24 w-24 rounded-full border overflow-hidden bg-primary/10 flex items-center justify-center">
                {currentUrl && !imageError ? (
                    <Image
                        src={currentUrl}
                        alt="Profile picture"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                    />
                ) : (
                    <UserIcon className="h-12 w-12 text-primary" />
                )}

                {/* Upload overlay */}
                {!isUploading && !isDeleting && (
                    <div
                        className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <CameraIcon className="h-8 w-8 text-white" />
                    </div>
                )}

                {/* Loading overlay */}
                {(isUploading || isDeleting) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isDeleting}
                >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    העלה תמונה
                </Button>

                {currentUrl && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isUploading || isDeleting}
                    >
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        הסר
                    </Button>
                )}

                {/* Hidden file input */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
        </div>
    );
}

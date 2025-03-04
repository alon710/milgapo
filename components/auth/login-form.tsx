// components/auth/login-form.tsx
"use client";

import { signInAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { authConfig } from "@/config/auth";
import { toast } from "sonner";
import { JSX, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/auth/submit-button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

type LoginFormProps = {
    description: JSX.Element;
    error: string | undefined;
};

export default function LoginForm({ description, error }: LoginFormProps) {
    const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
    const [contact, setContact] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, {
                id: "login-error",
                style: { background: "#fee2e2", color: "#dc2626" }
            });
        }
    }, [error]);

    async function handleSubmit() {
        await signInAction({ contact, method: contactMethod });
    }

    async function handleSocialSignIn(provider: "google" | "facebook") {
        const supabase = await createClient();
        const { data } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        });
        if (data.url) redirect(data.url);
    }

    return (
        <form className="w-full">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{authConfig.LoginButtonTitle}</h1>
                <div className="text-base text-foreground">{description}</div>
            </div>
            <div className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <ToggleGroup
                            type="single"
                            value={contactMethod}
                            onValueChange={(value) => value && setContactMethod(value as "email" | "phone")}
                            className="inline-flex rounded-md shadow-sm w-full max-w-xs"
                        >
                            <ToggleGroupItem
                                value="phone"
                                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                    contactMethod === "phone"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border"
                                }`}
                            >
                                {authConfig.phone}
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="email"
                                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                    contactMethod === "email"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border"
                                }`}
                            >
                                {authConfig.email}
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {contactMethod === "email" ? authConfig.email : authConfig.phone}
                        </Label>
                        <Input
                            id="contact"
                            name="contact"
                            type={contactMethod === "email" ? "email" : "tel"}
                            placeholder={contactMethod === "email" ? "email@example.com" : "0505625810"}
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <SubmitButton formAction={handleSubmit} pendingText={authConfig.LoginButtonPendingText}>
                    {authConfig.LoginButtonText}
                </SubmitButton>
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                        <span className="px-4 text-sm text-gray-500 dark:bg-gray-800 bg-white">
                            {authConfig.orContinueWith}
                        </span>
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            onClick={() => handleSocialSignIn("google")}
                            className="w-full py-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center font-medium rounded-md transition-colors"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            {authConfig.google}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSocialSignIn("facebook")}
                            className="w-full py-3 bg-[#1877F2] text-white hover:bg-blue-600 flex items-center justify-center font-medium rounded-md transition-colors"
                        >
                            <FaFacebookF className="h-5 w-5 mr-2" />
                            {authConfig.facebook}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { AuthButton } from "@/components/auth/auth-button";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

interface SocialLoginButtonProps {
    provider: "google" | "facebook";
    onClick: () => void;
    isLoading: boolean;
}

export function SocialLoginButton({ provider, onClick, isLoading }: SocialLoginButtonProps) {
    const { icon, text, className } = (() => {
        if (provider === "google") {
            return {
                icon: <FcGoogle className="text-xl" />,
                text: t.auth.login.googleButton,
                className: "bg-white text-black border border-gray-300 hover:bg-gray-100"
            };
        } else if (provider === "facebook") {
            return {
                icon: <FaFacebookF className="text-xl text-white" />,
                text: t.auth.login.facebookButton,
                className: "bg-[#1877F2] text-white hover:bg-blue-600 hover:text-white"
            };
        }
        return { icon: null, text: "", className: "" };
    })();

    return (
        <AuthButton
            type="button"
            onClick={onClick}
            isLoading={isLoading}
            className={`${className} flex items-center justify-center gap-2 h-10 shadow-sm`}
            variant="ghost"
        >
            <span className="flex items-center justify-center w-6 h-6">{!isLoading && icon}</span>
            <span>{text}</span>
        </AuthButton>
    );
}

export function SocialLoginButtons() {
    const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);

    async function handleSocialSignIn(provider: "google" | "facebook") {
        setLoadingProvider(provider);
        try {
            const supabase = await createClient();
            const { data } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${origin}/auth/callback`
                }
            });

            if (data.url) {
                redirect(data.url);
            }
        } catch {
            // Reset loading state on error
            setLoadingProvider(null);
        }
    }

    return (
        <div className="grid grid-cols-2 gap-3 mt-4">
            <SocialLoginButton
                provider="google"
                onClick={() => handleSocialSignIn("google")}
                isLoading={loadingProvider === "google"}
            />
            <SocialLoginButton
                provider="facebook"
                onClick={() => handleSocialSignIn("facebook")}
                isLoading={loadingProvider === "facebook"}
            />
        </div>
    );
}

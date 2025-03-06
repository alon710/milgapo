"use client";

import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

export function SocialLoginButtons() {
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
        facebook: false,
        google: false
    });
    const supabase = createClient();

    const handleSocialLogin = async (provider: "google" | "facebook") => {
        setIsLoading((prev) => ({ ...prev, [provider]: true }));

        try {
            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
        } catch {
            setIsLoading((prev) => ({ ...prev, [provider]: false }));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading.google}
                className="w-full h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
            >
                {isLoading.google ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="loading loading-spinner loading-xs"></span>
                        <span>{t.auth.login.sendingCode}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <FcGoogle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{t.auth.login.googleButton}</span>
                    </div>
                )}
            </Button>
            <Button
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading.facebook}
                className="w-full h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 bg-[#1877F2] text-white hover:bg-blue-600"
            >
                {isLoading.facebook ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="loading loading-spinner loading-xs"></span>
                        <span>{t.auth.login.sendingCode}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <FaFacebookF className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{t.auth.login.facebookButton}</span>
                    </div>
                )}
            </Button>
        </div>
    );
}

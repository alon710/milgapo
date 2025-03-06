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
        <div className="grid grid-cols-2 gap-3 sm:gap-2 mt-4 sm:mt-3">
            <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading.google}
                className="w-full h-12 sm:h-9 text-base sm:text-xs md:text-sm px-3 sm:px-2"
            >
                {isLoading.google ? (
                    <div className="flex items-center gap-2 sm:gap-1">
                        <span className="loading loading-spinner loading-sm sm:loading-xs"></span>
                        <span>{t.auth.login.signingIn}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-1">
                        <FcGoogle className="h-5 w-5 sm:h-3.5 sm:w-3.5" />
                        <span>{t.auth.login.googleButton}</span>
                    </div>
                )}
            </Button>
            <Button
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading.facebook}
                className="w-full h-12 sm:h-9 text-base sm:text-xs md:text-sm px-3 sm:px-2 bg-[#1877F2] text-white hover:bg-blue-600 hover:text-white"
            >
                {isLoading.facebook ? (
                    <div className="flex items-center gap-2 sm:gap-1">
                        <span className="loading loading-spinner loading-sm sm:loading-xs"></span>
                        <span>{t.auth.login.signingIn}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-1">
                        <FaFacebookF className="h-5 w-5 sm:h-3.5 sm:w-3.5" />
                        <span>{t.auth.login.facebookButton}</span>
                    </div>
                )}
            </Button>
        </div>
    );
}

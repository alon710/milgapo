"use client";

import { VerifyOtpParams } from "@supabase/supabase-js";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OTPInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

// TypeScript definitions for WebOTP API
interface OTPCredential extends Credential {
    code: string;
}

interface OTPCredentialRequestOptions {
    otp: { transport: string[] };
    signal?: AbortSignal;
}

// Helper function to get a cookie value
function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";").shift() || "";
        return decodeURIComponent(cookieValue);
    }
    return "";
}

export default function OTPForm() {
    const supabase = createClient();
    const router = useRouter();
    const [contact, setContact] = useState("");
    const [method, setMethod] = useState<"email" | "phone">("email");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    // Track if we've had a failed attempt already
    const [hadFailedAttempt, setHadFailedAttempt] = useState(false);
    // Track if auto-submission is currently allowed
    const autoSubmitAllowedRef = useRef(true);

    // Read contact and method from cookies on component mount
    useEffect(() => {
        // Client-side only
        if (typeof window !== "undefined") {
            const cookieContact = getCookie("auth_contact");
            const cookieMethod = getCookie("auth_method") as "email" | "phone";

            setContact(cookieContact);
            if (cookieMethod) {
                setMethod(cookieMethod);
            }

            if (!cookieContact) {
                setError(t.auth.errors.requiredField);
                const timer = setTimeout(() => {
                    router.push("/login");
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [router]);

    // Set up WebOTP API for SMS auto-fill on mobile
    useEffect(() => {
        if (typeof window !== "undefined" && method === "phone") {
            // Check if WebOTP API is available
            if ("OTPCredential" in window) {
                // Try to use the WebOTP API for SMS autofill
                try {
                    // Use a type assertion to avoid TypeScript errors with the WebOTP API
                    const abortController = new AbortController();
                    const { signal } = abortController;

                    // Cast to OTP credential interface
                    (
                        navigator.credentials as {
                            get(options: OTPCredentialRequestOptions): Promise<OTPCredential | null>;
                        }
                    )
                        .get({
                            otp: { transport: ["sms"] },
                            signal
                        })
                        .then((credential: OTPCredential | null) => {
                            if (credential?.code) {
                                setOtp(credential.code);
                                // Form will auto-submit due to the onComplete handler
                            }
                        })
                        .catch((err: Error) => {
                            // WebOTP API error - silently fail
                            console.log("WebOTP API error:", err);
                        });

                    // Cleanup abort controller after 3 minutes
                    const timeout = setTimeout(
                        () => {
                            abortController.abort();
                        },
                        3 * 60 * 1000
                    );

                    return () => {
                        clearTimeout(timeout);
                        abortController.abort();
                    };
                } catch (error) {
                    // Browser doesn't fully support WebOTP
                    console.log("WebOTP not fully supported", error);
                }
            }
        }
    }, [method]);

    // Handler for when all OTP digits are entered
    const handleOtpComplete = () => {
        // Only auto-submit if:
        // 1. We have all 6 digits
        // 2. We're not already submitting
        // 3. We haven't had a failed attempt
        // 4. Auto-submission is currently allowed
        if (otp.length === 6 && !isSubmitting && !hadFailedAttempt && autoSubmitAllowedRef.current) {
            // Prevent multiple rapid auto-submissions
            autoSubmitAllowedRef.current = false;
            // Automatically submit the form when all 6 digits are entered
            formRef.current?.requestSubmit();

            // Re-enable auto-submission after a delay (preventing multiple rapid submissions)
            setTimeout(() => {
                autoSubmitAllowedRef.current = true;
            }, 2000);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (otp.length !== 6) {
            setError(t.auth.otp.otpPlaceHolder);
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            let verifyParams: VerifyOtpParams;

            if (method === "email") {
                verifyParams = {
                    type: "email",
                    token: otp,
                    email: contact
                };
            } else {
                verifyParams = {
                    type: "sms",
                    token: otp,
                    phone: contact
                };
            }

            const { error: verifyError } = await supabase.auth.verifyOtp(verifyParams);

            if (verifyError) {
                // Set flag to prevent auto-resubmission after a failed attempt
                setHadFailedAttempt(true);
                setError(verifyError.message);

                // Optional: Clear the OTP input to force the user to re-enter the code
                // setOtp("");
            } else {
                // Clear the auth cookies after successful verification
                document.cookie = "auth_contact=; max-age=0; path=/; Secure; SameSite=Strict";
                document.cookie = "auth_method=; max-age=0; path=/; Secure; SameSite=Strict";
                router.push("/");
            }
        } catch (error) {
            // Also set flag for unexpected errors
            setHadFailedAttempt(true);
            setError(error instanceof Error ? error.message : t.auth.errors.serverError);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleBack() {
        setIsNavigating(true);
        router.push("/login");
    }

    return (
        <AuthLayout
            title={t.auth.otp.title}
            subtitle={`${t.auth.otp.subtitle} ${contact}`}
            topRightElement={
                <Button
                    type="button"
                    onClick={handleBack}
                    disabled={isNavigating || isSubmitting}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-7 sm:w-7 rounded-full hover:bg-secondary/80"
                    aria-label="Back to login"
                >
                    <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </Button>
            }
        >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-4 w-full">
                <div className="space-y-5 sm:space-y-4" data-page="otp">
                    {error && (
                        <div className="error-message text-base sm:text-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="py-3 sm:py-1">
                        <OTPInput
                            length={6}
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleOtpComplete}
                            onClick={() => {
                                // If there was a failed attempt and user clicks again, clear the OTP
                                if (hadFailedAttempt) {
                                    setOtp("");
                                    setHadFailedAttempt(false);
                                }
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-4 sm:mt-2">
                        <AuthButton
                            type="submit"
                            isLoading={isSubmitting}
                            loadingText={t.auth.otp.validatingCode}
                            disabled={otp.length !== 6 || isSubmitting}
                            className="h-12 sm:h-10 text-base sm:text-sm"
                        >
                            {t.auth.otp.submitButton}
                        </AuthButton>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}

"use client";

import { VerifyOtpParams } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OTPInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

export default function OTPForm() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const contact = searchParams.get("contact") || "";
    const method = (searchParams.get("method") as "email" | "phone") || "email";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (!contact) {
            setError(t.auth.errors.requiredField);
            const timer = setTimeout(() => {
                router.push("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [contact, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (otp.length !== 6) {
            setError(t.auth.otp.codeRequired);
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
                setError(verifyError.message);
            } else {
                router.push("/");
            }
        } catch (error) {
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
                    disabled={isNavigating}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-secondary/80"
                    aria-label="Back to login"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-6" data-page="otp">
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="py-2">
                        <OTPInput length={6} value={otp} onChange={setOtp} />
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <AuthButton
                            type="submit"
                            isLoading={isSubmitting}
                            loadingText={t.auth.otp.validatingCode}
                            disabled={otp.length !== 6}
                        >
                            {t.auth.otp.submitButton}
                        </AuthButton>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}

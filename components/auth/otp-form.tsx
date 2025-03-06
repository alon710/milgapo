"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OTPInput } from "@/components/auth/otp-input";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

export default function OTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contact = searchParams.get("contact") || "";
    const method = (searchParams.get("method") as "email" | "phone") || "email";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (otp.length !== 6) {
            setError(t.auth.otp.codeRequired);
            return;
        }

        setIsSubmitting(true);
        const supabase = await createClient();

        try {
            let result;
            if (method === "email") {
                result = await supabase.auth.verifyOtp({
                    email: contact,
                    token: otp,
                    type: "email"
                });
            } else {
                result = await supabase.auth.verifyOtp({
                    phone: contact,
                    token: otp,
                    type: "sms"
                });
            }

            if (result.error) {
                setIsSubmitting(false);
                if (result.error.message === "Token has expired or is invalid") {
                    setError(t.auth.otp.invalidCode);
                } else {
                    setError(result.error.message);
                }
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : t.auth.errors.serverError);
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
            subtitle={
                <span>
                    {t.auth.otp.subtitle} <strong>{contact}</strong>
                </span>
            }
            type="otp"
            backButton={{
                label: t.auth.otp.backButton,
                onClick: handleBack,
                isLoading: isNavigating
            }}
        >
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-6" data-page="otp">
                    {error && <div className="error-message">{error}</div>}

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

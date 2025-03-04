"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { authConfig } from "@/config/auth";

export default function OTPVerificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contact = searchParams.get("contact") || "";
    const method = (searchParams.get("method") as "email" | "phone") || "email";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const supabase = await createClient();

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
            setLoading(false);
            if (result.error.message === "Token has expired or is invalid") {
                setError(authConfig.OtpTokenExpiredError);
            } else {
                setError(result.error.message);
            }
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full p-4">
            <h1 className="text-2xl font-medium">{authConfig.otpTitle}</h1>
            <p>
                {authConfig.otpSubTitle} {contact}
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <Label htmlFor="otp">{authConfig.otp}</Label>
            <Input
                id="otp"
                name="otp"
                type="text"
                placeholder={authConfig.enterOtp}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
            />
            <Button type="submit" disabled={loading}>
                {loading ? authConfig.OtpButtonPendingText : authConfig.OtpButtonText}
            </Button>
        </form>
    );
}

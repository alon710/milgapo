"use client";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { heIL } from "@/config/languages/he";

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    onClick?: () => void;
}

// WebOTP API interfaces
interface OTPCredential extends Credential {
    code: string;
}

interface OTPCredentialRequestOptions {
    otp: { transport: string[] };
    signal?: AbortSignal;
}

export function OTPInput({ length, value, onChange, onComplete, onClick }: OTPInputProps) {
    // Use effect to set up WebOTP API
    useEffect(() => {
        // Check if WebOTP API is supported
        if ("OTPCredential" in window) {
            const input = document.querySelector('input[autocomplete="one-time-code"]');
            if (input) {
                // When the input is focused, trigger WebOTP
                input.addEventListener(
                    "focus",
                    () => {
                        if ("credentials" in navigator) {
                            try {
                                // Cast to OTP credential interface
                                (
                                    navigator.credentials as {
                                        get(options: OTPCredentialRequestOptions): Promise<OTPCredential | null>;
                                    }
                                )
                                    .get({
                                        otp: { transport: ["sms"] }
                                    })
                                    .then((credential: OTPCredential | null) => {
                                        if (credential?.code) {
                                            onChange(credential.code);
                                            if (credential.code.length === length && onComplete) {
                                                onComplete();
                                            }
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("WebOTP error:", err);
                                    });
                            } catch (error) {
                                console.log("WebOTP API not fully supported", error);
                            }
                        }
                    },
                    { once: true }
                );
            }
        }
    }, [length, onChange, onComplete]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits and limit to the specified length
        const newValue = e.target.value.replace(/\D/g, "").slice(0, length);

        // Update the value
        onChange(newValue);

        // Call onComplete if the new value matches the required length
        if (newValue.length === length && onComplete) {
            onComplete();
        }
    };

    return (
        <div className="w-full" dir="ltr" onClick={onClick}>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={length}
                placeholder={heIL.auth.otp.otpPlaceHolder}
                value={value}
                onChange={handleChange}
                className="w-full h-12 sm:h-10 text-center text-base sm:text-sm font-medium shadow-sm placeholder:text-center rounded-md transition-all duration-200"
                autoComplete="one-time-code"
                autoFocus
                id="otp-input"
            />
        </div>
    );
}

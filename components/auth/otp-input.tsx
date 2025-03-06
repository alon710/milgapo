"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { heIL } from "@/config/languages/he";

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    onClick?: () => void;
}

export function OTPInput({ length, value, onChange, onComplete, onClick }: OTPInputProps) {
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
                placeholder={heIL.auth.otp.codeRequired}
                value={value}
                onChange={handleChange}
                className="w-full h-12 sm:h-10 text-center text-base sm:text-sm font-medium shadow-sm placeholder:text-center rounded-md transition-all duration-200"
                autoComplete="one-time-code"
                autoFocus
            />
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
}

export function OTPInput({ length, value, onChange }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(value.split("").concat(Array(length - value.length).fill("")));
    const [inputRefs, setInputRefs] = useState<HTMLInputElement[]>([]);
    const [activeInput, setActiveInput] = useState<number>(-1);

    const setRef = (el: HTMLInputElement | null, index: number) => {
        if (el && !inputRefs[index]) {
            const newRefs = [...inputRefs];
            newRefs[index] = el;
            setInputRefs(newRefs);
        }
    };

    useEffect(() => {
        setOtp(value.split("").concat(Array(length - value.length).fill("")));
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value;

        if (newValue.length > 1 || !/^\d*$/.test(newValue)) return;

        const newOtp = [...otp];
        newOtp[index] = newValue;
        setOtp(newOtp);

        onChange(newOtp.join(""));

        if (newValue && index < length - 1 && inputRefs[index + 1]) {
            inputRefs[index + 1].focus();
            setActiveInput(index + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs[index - 1]) {
            inputRefs[index - 1].focus();
            setActiveInput(index - 1);
        } else if (e.key === "ArrowLeft" && index > 0 && inputRefs[index - 1]) {
            inputRefs[index - 1].focus();
            setActiveInput(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1 && inputRefs[index + 1]) {
            inputRefs[index + 1].focus();
            setActiveInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();

        const newOtp = [...otp];

        const digits = pastedData.replace(/\D/g, "").split("");

        const startIndex = activeInput !== -1 ? activeInput : 0;

        for (let i = 0; i < Math.min(digits.length, length - startIndex); i++) {
            newOtp[startIndex + i] = digits[i];
        }

        setOtp(newOtp);
        onChange(newOtp.join(""));

        const nextEmptyIndex = newOtp.findIndex((val, idx) => !val && idx >= startIndex);
        if (nextEmptyIndex !== -1 && inputRefs[nextEmptyIndex]) {
            inputRefs[nextEmptyIndex].focus();
            setActiveInput(nextEmptyIndex);
        } else if (startIndex + digits.length < length && inputRefs[startIndex + digits.length]) {
            inputRefs[startIndex + digits.length].focus();
            setActiveInput(startIndex + digits.length);
        } else if (inputRefs[length - 1]) {
            inputRefs[length - 1].focus();
            setActiveInput(length - 1);
        }
    };

    const handleFocus = (index: number) => {
        setActiveInput(index);
    };

    const handleBlur = () => {
        setActiveInput(-1);
    };

    return (
        <div className="flex justify-center gap-1 sm:gap-2 ltr" dir="ltr">
            {otp.map((digit, index) => (
                <div key={index} className="w-9 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 relative">
                    <Input
                        ref={(el) => setRef(el, index)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={() => handleFocus(index)}
                        onBlur={handleBlur}
                        className={`
                            text-center text-base sm:text-lg md:text-xl font-medium 
                            h-10 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 
                            p-0 transition-all duration-300
                            ${activeInput === index ? "ring-2 ring-primary ring-offset-1 sm:ring-offset-2" : ""}
                            ${digit ? "bg-primary/5 border-primary/30" : ""}
                        `}
                        autoFocus={index === 0 && !digit}
                    />
                    {index < length - 1 && (
                        <div className="absolute top-1/2 -right-1 sm:-right-2 w-1 sm:w-2 h-[1px] sm:h-[2px] bg-gray-300" />
                    )}
                </div>
            ))}
        </div>
    );
}

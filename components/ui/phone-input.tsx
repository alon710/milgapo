"use client";

import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { t } from "@/config/languages";
import { cn } from "@/lib/utils";

// Zod schema for Israeli phone numbers
const phoneSchema = z
    .string()
    .min(10, { message: t.auth.errors.invalidPhone })
    .max(10, { message: t.auth.errors.invalidPhone })
    .refine((val) => /^05\d{8}$/.test(val), {
        message: t.auth.errors.invalidPhone
    });

type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
        error?: string;
        setError?: (error: string) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProps
>(({ className, onChange, value, error, setError, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get the raw input value
        const inputValue = event.target.value;

        // Remove any non-digit characters
        const digits = inputValue.replace(/\D/g, "");

        // Process the digits (max 10 digits)
        let formattedInput = "";

        if (digits.length > 0) {
            // Ensure it starts with '05'
            if (digits.startsWith("5") && digits.length === 1) {
                // If user just typed '5', add '0' prefix
                formattedInput = "05";
            } else if (!digits.startsWith("0") && digits.length >= 1) {
                // If it doesn't start with '0', add it
                formattedInput = "0" + digits.substring(0, 9);
            } else {
                // Otherwise use the digits as is (max 10)
                formattedInput = digits.substring(0, 10);
            }
        }

        // Clear any previous error when the user types
        if (setError && formattedInput !== displayValue) {
            setError("");
        }

        // If we have a valid looking 10-digit phone number
        if (formattedInput.length === 10 && formattedInput.startsWith("05")) {
            // Validate with Zod
            const validationResult = phoneSchema.safeParse(formattedInput);

            if (validationResult.success) {
                // Convert to E.164 format for internal use (strip the 0, add +972)
                const e164Format = `+972${formattedInput.substring(1)}`;
                onChange?.(e164Format as unknown as RPNInput.Value);
            } else if (setError) {
                // Set validation error
                setError(validationResult.error.errors[0].message);
                // Still pass the value to keep the field controlled
                onChange?.(formattedInput as unknown as RPNInput.Value);
            }
        } else if (formattedInput) {
            // Just pass the formatted input for partial numbers
            onChange?.(formattedInput as unknown as RPNInput.Value);
        } else {
            // Empty input
            onChange?.("" as unknown as RPNInput.Value);
        }
    };

    // Extract the local format from E.164 if needed
    const displayValue = React.useMemo(() => {
        if (typeof value === "string" && value.startsWith("+972")) {
            // Convert from E.164 to local format
            return "0" + value.substring(4);
        }
        return value as string;
    }, [value]);

    return (
        <div className={cn("flex flex-col w-full", className)}>
            <div className={cn("flex h-full w-full")}>
                <div
                    className={cn(
                        "flex items-center justify-center px-3 sm:px-2 bg-secondary/30 border border-input border-r-0 rounded-s-lg h-full",
                        error && "border-destructive"
                    )}
                >
                    <IsraelFlag />
                </div>
                <InputComponent
                    ref={ref as React.Ref<HTMLInputElement>}
                    value={displayValue || ""}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        // Allow only digits, backspace, delete, arrow keys, etc.
                        if (
                            !/^\d$/.test(e.key) && // not a digit
                            !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) && // not a control key
                            !e.ctrlKey &&
                            !e.metaKey // not a keyboard shortcut
                        ) {
                            e.preventDefault();
                        }
                    }}
                    onBlur={() => {
                        // Validate on blur
                        if (displayValue && displayValue.length > 0 && setError) {
                            const validationResult = phoneSchema.safeParse(displayValue);
                            if (!validationResult.success) {
                                setError(validationResult.error.errors[0].message);
                            }
                        }
                    }}
                    aria-invalid={!!error}
                    className={error ? "border-destructive" : undefined}
                    {...props}
                />
            </div>
        </div>
    );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => (
        <Input
            className={cn("rounded-s-none rounded-e-lg h-full", className)}
            placeholder={props.placeholder || "0501234567"}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            title="Please enter a 10-digit phone number starting with 05"
            {...props}
            ref={ref}
        />
    )
);
InputComponent.displayName = "InputComponent";

// Simple component to display Israel flag
const IsraelFlag = () => {
    const Flag = flags.IL;
    return (
        <span className="flex h-5 w-7 sm:h-3.5 sm:w-5 overflow-hidden [&_svg]:size-full">
            {Flag && <Flag title="ישראל" />}
        </span>
    );
};

export { PhoneInput };

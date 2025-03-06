"use client";

import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
    return (
        <div className={cn("flex", className)}>
            <div className="flex items-center justify-center px-2 sm:px-3 bg-secondary/30 border border-input border-r-0 rounded-s-lg">
                <IsraelFlag />
            </div>
            <InputComponent
                ref={ref as React.Ref<HTMLInputElement>}
                onChange={(e) => {
                    // Convert regular input value to E.164 format with +972 prefix
                    const inputValue = e.target.value;
                    let phoneValue = inputValue;

                    // Only add the +972 prefix if there's actual input
                    if (inputValue && !inputValue.startsWith("+")) {
                        // Remove leading zeros if present
                        const cleaned = inputValue.replace(/^0+/, "");
                        phoneValue = `+972${cleaned}`;
                    }

                    onChange?.(phoneValue as RPNInput.Value);
                }}
                {...props}
            />
        </div>
    );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => (
        <Input
            className={cn("rounded-s-none rounded-e-lg", className)}
            placeholder={props.placeholder || "0501234567"}
            type="tel"
            inputMode="tel"
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
        <span className="flex h-3.5 w-5 sm:h-4 sm:w-6 overflow-hidden [&_svg]:size-full">
            {Flag && <Flag title="ישראל" />}
        </span>
    );
};

export { PhoneInput };

"use client";

import { Loader2 } from "lucide-react";
import React from "react";

import { Button, ButtonProps } from "@/components/ui/button";

interface AuthButtonProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function AuthButton({
    isLoading = false,
    loadingText,
    children,
    className = "",
    disabled,
    ...props
}: AuthButtonProps) {
    return (
        <Button className={`w-full shadow-sm ${className}`} disabled={isLoading || disabled} {...props}>
            {isLoading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-1.5">
                    {loadingText || children}
                    <Loader2 className="h-5 w-5 sm:h-3.5 sm:w-3.5 animate-spin" />
                </span>
            ) : (
                children
            )}
        </Button>
    );
}

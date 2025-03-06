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
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {loadingText || children}
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                </span>
            ) : (
                children
            )}
        </Button>
    );
}

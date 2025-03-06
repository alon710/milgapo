"use client";

import { ReactNode } from "react";

import { TermsFooter } from "@/components/auth/terms-footer";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
};

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
    return (
        <div
            className={cn(
                "min-h-screen w-full flex items-center justify-center px-4 py-12 bg-gradient-to-b from-secondary to-background",
                className
            )}
        >
            <div className="w-full max-w-md space-y-6">
                <div className="bg-card p-8 rounded-lg shadow-sm space-y-6">
                    {title && <h1 className="text-2xl font-medium text-center">{title}</h1>}
                    {subtitle && <p className="text-muted-foreground text-center">{subtitle}</p>}
                    {children}
                </div>
                <TermsFooter />
            </div>
        </div>
    );
}

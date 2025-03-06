"use client";

import { ReactNode } from "react";

import { TermsFooter } from "@/components/auth/terms-footer";
import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    topRightElement?: ReactNode;
};

export function AuthLayout({ children, title, subtitle, className, topRightElement }: AuthLayoutProps) {
    return (
        <div
            className={cn(
                "min-h-screen w-full flex items-center justify-center px-4 py-6 sm:py-12 bg-gradient-to-b from-secondary to-background",
                className
            )}
        >
            <div className="w-full max-w-md space-y-4 sm:space-y-6">
                <div className="flex justify-center mb-4 sm:mb-6">
                    <SiteLogo href="/" />
                </div>
                <div className="bg-card p-5 sm:p-8 rounded-lg shadow-sm space-y-4 sm:space-y-6 relative">
                    {topRightElement && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">{topRightElement}</div>
                    )}
                    {title && <h1 className="text-xl sm:text-2xl font-medium text-center">{title}</h1>}
                    {subtitle && <p className="text-sm sm:text-base text-muted-foreground text-center">{subtitle}</p>}
                    {children}
                </div>
                <TermsFooter />
            </div>
        </div>
    );
}

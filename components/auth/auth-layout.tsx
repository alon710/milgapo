"use client";

import { ReactNode } from "react";

import { TermsFooter } from "@/components/auth/terms-footer";
import { SiteLogo } from "@/components/layout/site-logo";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    topRightElement?: ReactNode;
    isLoading?: boolean;
    skeletonContent?: ReactNode;
};

export function AuthLayout({
    children,
    title,
    subtitle,
    className,
    topRightElement,
    isLoading = false,
    skeletonContent
}: AuthLayoutProps) {
    return (
        <div
            className={cn(
                "min-h-screen w-full relative flex flex-col items-center justify-center px-2 py-4 sm:px-4 sm:py-6 md:py-12",
                className
            )}
        >
            {/* Logo fixed to top on mobile, centered above content on larger screens */}
            <div className="fixed sm:static top-4 left-0 w-full flex justify-center mb-0 sm:mb-6 z-10">
                <div className="scale-100">
                    <SiteLogo href="/" />
                </div>
            </div>

            {/* Main auth card with adjusted top margin for mobile */}
            <div className="w-full sm:max-w-md md:max-w-lg space-y-4 sm:space-y-6 mt-16 sm:mt-0">
                <div className="bg-card px-4 py-6 sm:p-5 md:p-8 rounded-lg shadow-sm space-y-5 sm:space-y-6 relative">
                    {topRightElement && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                            {isLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : topRightElement}
                        </div>
                    )}
                    <div className="space-y-1 sm:space-y-2">
                        {title &&
                            (isLoading ? (
                                <Skeleton className="h-8 w-3/4 mx-auto" />
                            ) : (
                                <h1 className="text-2xl sm:text-xl md:text-2xl font-medium text-center">{title}</h1>
                            ))}
                        {subtitle &&
                            (isLoading ? (
                                <Skeleton className="h-5 w-2/3 mx-auto mt-2" />
                            ) : (
                                <p className="text-base sm:text-sm md:text-base text-muted-foreground text-center">
                                    {subtitle}
                                </p>
                            ))}
                    </div>
                    {isLoading
                        ? skeletonContent || (
                              <div className="space-y-4">
                                  <Skeleton className="h-12 w-full rounded-md" />
                                  <Skeleton className="h-12 w-full rounded-md" />
                                  <Skeleton className="h-12 w-full rounded-md" />
                                  <Skeleton className="h-12 w-1/2 rounded-md mx-auto" />
                              </div>
                          )
                        : children}
                </div>
                <div className="text-sm sm:text-xs md:text-sm">
                    {isLoading ? (
                        <div className="flex justify-center space-x-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ) : (
                        <TermsFooter />
                    )}
                </div>
            </div>
        </div>
    );
}

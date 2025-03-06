import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Rubik } from "next/font/google";

import { AuthProvider } from "@/components/auth/auth-provider";
import { DirectionProviderRTL } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
    subsets: ["latin", "hebrew"],
    weight: ["300", "400", "500", "600"],
    display: "swap",
    variable: "--font-rubik"
});

export default function AuthLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DirectionProviderRTL>
            <html lang="he" dir="rtl" className={rubik.className} suppressHydrationWarning>
                <body
                    className="text-foreground flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white"
                    suppressHydrationWarning
                >
                    <AuthProvider>{children}</AuthProvider>

                    <SpeedInsights />
                    <Analytics />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            classNames: {
                                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                                description: "group-[.toast]:text-muted-foreground",
                                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
                            }
                        }}
                    />
                </body>
            </html>
        </DirectionProviderRTL>
    );
}

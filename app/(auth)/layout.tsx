import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";

import { SiteLogo } from "@/components/layout/site-logo";
import { DirectionProviderRTL } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DirectionProviderRTL>
            <html className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground flex flex-col min-h-screen">
                    <div className="flex-grow flex flex-col justify-center items-center px-4 py-8">
                        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4">
                            <div className="w-full flex justify-center h-16">
                                <SiteLogo href="/" />
                            </div>
                            {children}
                        </div>
                    </div>

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

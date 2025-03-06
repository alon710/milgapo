import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Rubik } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
    subsets: ["latin", "hebrew"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-rubik"
});

export const metadata = {
    title: "Milgapo",
    description: "Search and aggregate scholarships"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={rubik.className}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    {children}

                    <SpeedInsights />
                    <Analytics />
                    <Toaster position="bottom-left" />
                </ThemeProvider>
            </body>
        </html>
    );
}

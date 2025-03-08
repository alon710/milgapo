// app/layout.tsx or app/layout.js
import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";

import { DirectionProviderRTL } from "@/components/providers";
import { UserProvider } from "@/context/user-context";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <DirectionProviderRTL>
            <html className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground" suppressHydrationWarning>
                    <UserProvider user={user}>{children}</UserProvider>
                    <SpeedInsights />
                    <Analytics />
                </body>
            </html>
        </DirectionProviderRTL>
    );
}

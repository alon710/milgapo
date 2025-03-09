// app/layout.tsx or app/layout.js
import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BarChart3, ChevronRight, Home, Menu, Settings, User, Users } from "lucide-react";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import HeaderAuth from "@/components/header-auth";
import { SiteLogo } from "@/components/layout/site-logo";
import { DirectionProviderRTL } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { t } from "@/config/languages";
import { UserProvider } from "@/context/user-context";
import { createClient } from "@/utils/supabase/server";

import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

// Define user type to avoid 'any'
interface UserWithMetadata {
    id: string;
    email?: string;
    phone?: string;
    user_metadata?: {
        avatar_url?: string;
        picture?: string;
        profile_image?: string;
        full_name?: string;
        name?: string;
    };
}

// Sidebar content component to reuse in both desktop and mobile views
function SidebarContent({ user }: { user: UserWithMetadata }) {
    // Define navigation items with their paths and icons
    const navItems = [
        { name: t.dashboard.navigation.dashboard, path: "/dashboard", icon: Home, active: true },
        { name: t.dashboard.navigation.analytics, path: "/dashboard/analytics", icon: BarChart3, active: false },
        { name: t.dashboard.navigation.users, path: "/dashboard/users", icon: Users, active: false }
    ];

    // Get the user's avatar URL or use a default avatar if not available
    const avatarUrl =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.profile_image;

    return (
        <>
            <div className="h-16 border-b flex items-center px-4">
                <SiteLogo href="/dashboard" />
            </div>
            <ScrollArea className="flex-1">
                <div className="py-4">
                    <div className="px-3 pb-2">
                        <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">
                            {t.dashboard.navigation.title}
                        </h2>
                    </div>
                    <nav className="space-y-1 px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all
                                        ${
                                            item.active
                                                ? "bg-primary/10 text-primary font-medium shadow-sm"
                                                : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`h-5 w-5 ${
                                                item.active ? "text-primary" : "text-muted-foreground"
                                            }`}
                                        />
                                        <span className={item.active ? "font-medium" : ""}>{item.name}</span>
                                    </div>
                                    {item.active && <ChevronRight className="h-4 w-4 text-primary opacity-70" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Profile picture"
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {t.dashboard.userProfile.defaultRole}
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/settings" title={t.dashboard.userProfile.settingsTooltip}>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted/50 hover:bg-muted">
                            <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default async function DashboardLayout({
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
            <html lang="he" dir="rtl" className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground h-screen flex flex-col" suppressHydrationWarning>
                    <div className="flex h-screen overflow-hidden">
                        {/* Desktop Sidebar */}
                        <aside className="hidden md:flex flex-col w-64 border-s bg-card shadow-sm overflow-hidden">
                            <SidebarContent user={user} />
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <header className="border-b bg-card py-3 px-4 flex items-center justify-between h-16">
                                {/* Mobile sidebar trigger and title */}
                                <div className="flex items-center gap-4">
                                    {/* Mobile sidebar */}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon" className="md:hidden">
                                                <Menu className="h-5 w-5" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="p-0 flex flex-col w-64">
                                            <SidebarContent user={user} />
                                        </SheetContent>
                                    </Sheet>

                                    <h1 className="text-lg font-semibold">{t.dashboard.header.title}</h1>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <HeaderAuth />
                                </div>
                            </header>

                            {/* Main content area */}
                            <main className="flex-1 overflow-auto p-4">
                                <div className="mx-auto max-w-7xl">
                                    <UserProvider user={user}>{children}</UserProvider>
                                </div>
                            </main>
                        </div>
                    </div>
                    <SpeedInsights />
                    <Analytics />
                </body>
            </html>
        </DirectionProviderRTL>
    );
}

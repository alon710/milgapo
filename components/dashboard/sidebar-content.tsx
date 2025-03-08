"use client";

import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTransition } from "react";

import { signOutAction } from "@/app/actions";
import { SiteLogo } from "@/components/layout/site-logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { t } from "@/config/languages";

import { SidebarNavigation } from "./sidebar-navigation";

// Define user type
export interface UserWithMetadata {
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

interface SidebarContentProps {
    user: UserWithMetadata;
    onNavigate?: () => void;
    isMobile?: boolean;
}

export function SidebarContent({ user, onNavigate }: SidebarContentProps) {
    // State to track if image failed to load
    const [imageError, setImageError] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Get the user's avatar URL or use a default avatar if not available
    const avatarUrl =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.profile_image;

    const handleImageError = () => {
        setImageError(true);
    };

    const handleLogout = () => {
        if (onNavigate) {
            onNavigate();
        }
        startTransition(() => {
            signOutAction();
        });
    };

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
                    <SidebarNavigation onNavigate={onNavigate} />
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {avatarUrl && !imageError ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Profile picture"
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-cover"
                                    onError={handleImageError}
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 bg-muted/50 hover:bg-muted"
                        title="התנתק"
                        onClick={handleLogout}
                        disabled={isPending}
                    >
                        <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Button>
                </div>
            </div>
        </>
    );
}

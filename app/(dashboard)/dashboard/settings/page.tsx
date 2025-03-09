"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Provider, UserIdentity } from "@supabase/supabase-js";
// Temporarily use a simpler Avatar component until UserAvatarUpload is properly registered
import { User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { t } from "@/config/languages";
import { useUser } from "@/context/user-context";
import { createClient } from "@/utils/supabase/client";

// Provider display names
const providerNames: Record<string, string> = {
    google: "Google",
    facebook: "Facebook",
    email: "Email/Password",
    phone: "Phone"
};

// Validation schema for user settings form
const userSettingsSchema = z.object({
    email: z.string().email({ message: "נא להזין כתובת דוא״ל תקינה" }),
    phone: z
        .string()
        .min(10, { message: t.auth.errors.invalidPhone })
        .max(10, { message: t.auth.errors.invalidPhone })
        .refine((val) => /^05\d{8}$/.test(val), {
            message: t.auth.errors.invalidPhone
        })
        .optional()
        .or(z.literal("")),
    avatar_url: z.string().optional().nullable()
});

// Schema for delete account confirmation
const deleteAccountSchema = z.object({
    confirmationText: z.string().refine((val) => val === "DELETE", {
        message: 'יש להקליד "DELETE" כדי לאשר את המחיקה'
    })
});

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

// Simple Avatar component as a temporary replacement
function UserAvatarUpload({
    currentUrl,
    onUploadComplete
}: {
    currentUrl: string | null;
    onUploadComplete: (url: string | null) => void;
    // The user parameter is used by the consumer, but we don't use it internally
    user?: unknown;
}) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24 rounded-full border overflow-hidden bg-primary/10 flex items-center justify-center">
                {currentUrl ? (
                    <Image
                        src={currentUrl}
                        alt="Profile picture"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        onError={() => onUploadComplete(null)}
                    />
                ) : (
                    <User className="h-12 w-12 text-primary" />
                )}
            </div>
            <div className="text-center text-sm text-muted-foreground">העלאת תמונות תהיה זמינה בקרוב</div>
        </div>
    );
}

export default function SettingsPage() {
    const user = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.profile_image || null
    );
    const [identities, setIdentities] = useState<UserIdentity[]>([]);
    const [isLoadingIdentities, setIsLoadingIdentities] = useState(true);
    const [isLinking, setIsLinking] = useState(false);
    const [isUnlinking, setIsUnlinking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Initialize form with user data
    const form = useForm<UserSettingsFormValues>({
        resolver: zodResolver(userSettingsSchema),
        defaultValues: {
            email: user.email || "",
            phone: user.phone || user.user_metadata?.phone || "",
            avatar_url: avatarUrl
        }
    });

    // Initialize delete confirmation form without default value
    const deleteForm = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountSchema)
    });

    // Fetch user identities on component mount
    useEffect(() => {
        async function fetchIdentities() {
            setIsLoadingIdentities(true);
            try {
                const supabase = createClient();
                const { data, error } = await supabase.auth.getUserIdentities();

                if (error) {
                    throw error;
                }

                if (data && data.identities) {
                    setIdentities(data.identities);
                }
            } catch (error) {
                console.error("Error fetching identities:", error);
                toast.error("Failed to load linked accounts");
            } finally {
                setIsLoadingIdentities(false);
            }
        }

        fetchIdentities();
    }, []);

    // Link a new identity
    const handleLinkIdentity = async (provider: Provider) => {
        setIsLinking(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.linkIdentity({ provider });

            if (error) {
                throw error;
            }

            toast.success(`Successfully linked ${providerNames[provider] || provider} account`);

            // Refresh identities
            const { data: identitiesData } = await supabase.auth.getUserIdentities();
            if (identitiesData && identitiesData.identities) {
                setIdentities(identitiesData.identities);
            }
        } catch (error) {
            console.error("Error linking identity:", error);
            toast.error(`Failed to link ${providerNames[provider] || provider} account`);
        } finally {
            setIsLinking(false);
        }
    };

    // Unlink an existing identity
    const handleUnlinkIdentity = async (identity: UserIdentity) => {
        if (identities.length <= 1) {
            toast.error("Cannot unlink the only identity. Add another login method first.");
            return;
        }

        setIsUnlinking(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.unlinkIdentity(identity);

            if (error) {
                throw error;
            }

            // Update identities list
            setIdentities(identities.filter((i) => i.identity_id !== identity.identity_id));
            toast.success(`Successfully unlinked ${providerNames[identity.provider] || identity.provider} account`);
        } catch (error) {
            console.error("Error unlinking identity:", error);
            toast.error(`Failed to unlink ${providerNames[identity.provider] || identity.provider} account`);
        } finally {
            setIsUnlinking(false);
        }
    };

    // Handle form submission
    const onSubmit = async (data: UserSettingsFormValues) => {
        setIsSubmitting(true);
        try {
            // Update user profile with new data
            await updateUserProfile({
                email: data.email,
                // Convert empty string to undefined
                phone: data.phone === "" ? undefined : data.phone,
                user_metadata: {
                    ...user.user_metadata,
                    avatar_url: avatarUrl
                }
            });

            toast.success("הפרופיל עודכן בהצלחה");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("אירעה שגיאה בעדכון הפרופיל");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.admin.deleteUser(user.id);

            if (error) {
                throw error;
            }

            // Sign out and redirect after deletion
            await supabase.auth.signOut();
            window.location.href = "/";

            toast.success("Account successfully deleted");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account. Please try again later.");
            setShowDeleteDialog(false);
        } finally {
            setIsDeleting(false);
        }
    };

    // Check if Google is linked
    const isGoogleLinked = identities.some((identity) => identity.provider === "google");

    // Check if Facebook is linked
    const isFacebookLinked = identities.some((identity) => identity.provider === "facebook");

    return (
        // Use flex layout with h-full instead of absolute positioning
        <div className="flex flex-col h-full w-full">
            <div className="bg-card border rounded-lg flex-1 flex flex-col overflow-auto">
                {/* Title and subtitle inside the card */}
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold mb-2">הגדרות משתמש</h1>
                    <p className="text-muted-foreground">עדכן את פרטי המשתמש שלך ואת הגדרות החשבון.</p>
                </div>

                <div className="p-6 flex-1 overflow-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
                            {/* Avatar Upload - Now at the top of the form */}
                            <div className="flex flex-col items-center pb-6 mb-6 border-b">
                                <h2 className="text-xl font-semibold mb-4 self-start">תמונת פרופיל</h2>
                                <UserAvatarUpload currentUrl={avatarUrl} onUploadComplete={setAvatarUrl} />
                            </div>

                            {/* Profile information section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">פרטים אישיים</h2>
                                <div className="space-y-6">
                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>כתובת דוא״ל</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="your.email@example.com" {...field} />
                                                </FormControl>
                                                <FormDescription>כתובת הדוא״ל המשמשת לחשבון שלך.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone Field */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>מספר טלפון</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="05XXXXXXXX"
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormDescription>מספר הטלפון הנייד שלך.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Linked Accounts Section */}
                            <div className="border-t pt-6 mt-6">
                                <h2 className="text-xl font-bold mb-4">חשבונות מקושרים</h2>
                                <p className="text-muted-foreground mb-4">
                                    קשר את החשבון שלך לשירותי התחברות חברתיים כדי להתחבר בקלות.
                                </p>

                                {isLoadingIdentities ? (
                                    <div className="py-4">טוען חשבונות מקושרים...</div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Google button */}
                                        <div className="flex items-center justify-between p-4 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    G
                                                </div>
                                                <div>
                                                    <p className="font-medium">Google</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {isGoogleLinked
                                                            ? "מחובר לחשבון Google"
                                                            : "קשר את חשבון Google שלך"}
                                                    </p>
                                                </div>
                                            </div>
                                            {isGoogleLinked ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const googleIdentity = identities.find(
                                                            (i) => i.provider === "google"
                                                        );
                                                        if (googleIdentity) handleUnlinkIdentity(googleIdentity);
                                                    }}
                                                    disabled={isUnlinking || identities.length <= 1}
                                                >
                                                    הסר קישור
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleLinkIdentity("google")}
                                                    disabled={isLinking}
                                                >
                                                    קשר חשבון
                                                </Button>
                                            )}
                                        </div>

                                        {/* Facebook button */}
                                        <div className="flex items-center justify-between p-4 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    FB
                                                </div>
                                                <div>
                                                    <p className="font-medium">Facebook</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {isFacebookLinked
                                                            ? "מחובר לחשבון Facebook"
                                                            : "קשר את חשבון Facebook שלך"}
                                                    </p>
                                                </div>
                                            </div>
                                            {isFacebookLinked ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const facebookIdentity = identities.find(
                                                            (i) => i.provider === "facebook"
                                                        );
                                                        if (facebookIdentity) handleUnlinkIdentity(facebookIdentity);
                                                    }}
                                                    disabled={isUnlinking || identities.length <= 1}
                                                >
                                                    הסר קישור
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleLinkIdentity("facebook")}
                                                    disabled={isLinking}
                                                >
                                                    קשר חשבון
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="border-t pt-6 mt-6">
                                <h2 className="text-xl font-bold mb-4 text-destructive">אזור סכנה</h2>
                                <p className="text-muted-foreground mb-4">
                                    פעולות שלא ניתן לבטל. נא לנקוט משנה זהירות.
                                </p>

                                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                                    <h3 className="font-medium mb-2">מחיקת חשבון</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        מחיקת חשבון היא פעולה קבועה ובלתי הפיכה. כל הנתונים האישיים שלך יימחקו לצמיתות.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        מחק את החשבון שלי
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 text-left">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "מעדכן..." : "שמור שינויים"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>אישור מחיקת חשבון</DialogTitle>
                        <DialogDescription>
                            פעולה זו תמחק לצמיתות את כל הנתונים האישיים שלך ולא ניתן יהיה לשחזרם.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Form {...deleteForm}>
                            <form onSubmit={deleteForm.handleSubmit(handleDeleteAccount)} className="space-y-4">
                                <FormField
                                    control={deleteForm.control}
                                    name="confirmationText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>הקלד &quot;DELETE&quot; כדי לאשר</FormLabel>
                                            <FormControl>
                                                <Input placeholder="DELETE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter className="sm:justify-between">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            ביטול
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" variant="destructive" disabled={isDeleting}>
                                        {isDeleting ? "מוחק..." : "אישור מחיקת חשבון"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

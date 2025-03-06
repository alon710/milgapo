"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { DividerText } from "@/components/ui/divider-text";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

type LoginFormProps = {
    error: string | undefined;
};

const formSchema = z.object({
    contactMethod: z.enum(["email", "phone"]),
    contact: z.string().refine((value) => {
        if (!value) return false;

        const trimmed = value.trim();
        if (trimmed === "") return false;

        return true;
    }, t.auth.errors.requiredField)
});

export default function LoginForm({ error }: LoginFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(error || "");
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contactMethod: "email",
            contact: ""
        }
    });

    const contactMethod = form.watch("contactMethod");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setFormError("");

        const { contactMethod, contact } = values;

        if (contactMethod === "phone" && !isValidPhoneNumber(contact)) {
            setFormError(t.auth.errors.invalidPhone);
            return;
        }

        if (contactMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
            setFormError(t.auth.errors.invalidEmail);
            return;
        }

        setIsSubmitting(true);

        try {
            let result;

            if (contactMethod === "email") {
                result = await supabase.auth.signInWithOtp({
                    email: contact,
                    options: {
                        shouldCreateUser: false
                    }
                });
            } else {
                result = await supabase.auth.signInWithOtp({
                    phone: contact,
                    options: {
                        shouldCreateUser: false
                    }
                });
            }

            if (result.error) {
                setFormError(result.error.message);
            } else {
                const redirectTo = `/otp?contact=${encodeURIComponent(contact)}&method=${contactMethod}`;
                window.location.href = redirectTo;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t.auth.errors.serverError;
            setFormError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title={t.auth.login.title} subtitle={t.auth.login.subtitle}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 w-full">
                    <div className="space-y-4 sm:space-y-6" data-page="login">
                        {formError && (
                            <div className="error-message text-sm sm:text-base">
                                <span>{formError}</span>
                            </div>
                        )}

                        <div>
                            <ToggleGroup
                                type="single"
                                value={contactMethod}
                                onValueChange={(value) => {
                                    if (value) {
                                        form.setValue("contactMethod", value as "email" | "phone");
                                        form.setValue("contact", "");
                                        if (formError) setFormError("");
                                    }
                                }}
                                className="justify-center"
                            >
                                <ToggleGroupItem
                                    value="email"
                                    aria-label={t.auth.login.emailToggle}
                                    className="flex-1 px-3 py-1.5 sm:py-2 text-sm sm:text-base data-[state=on]:bg-primary/10"
                                >
                                    {t.auth.login.emailToggle}
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="phone"
                                    aria-label={t.auth.login.phoneToggle}
                                    className="flex-1 px-3 py-1.5 sm:py-2 text-sm sm:text-base data-[state=on]:bg-primary/10"
                                >
                                    {t.auth.login.phoneToggle}
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {contactMethod === "email" ? (
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder={t.auth.login.emailPlaceholder}
                                                className="text-left shadow-sm text-sm sm:text-base h-10 sm:h-11"
                                                dir="ltr"
                                            />
                                        ) : (
                                            <div dir="ltr">
                                                <PhoneInput
                                                    {...field}
                                                    placeholder={t.auth.login.phonePlaceholder}
                                                    className="shadow-sm text-sm sm:text-base h-10 sm:h-11"
                                                    onChange={(value) => {
                                                        if (formError) setFormError("");
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </FormControl>
                                    <FormMessage className="text-xs sm:text-sm" />
                                </FormItem>
                            )}
                        />

                        <div>
                            <AuthButton
                                type="submit"
                                isLoading={isSubmitting}
                                loadingText={t.auth.login.sendingCode}
                                className="h-10 sm:h-11 text-sm sm:text-base"
                            >
                                {t.auth.login.submitButton}
                            </AuthButton>
                        </div>
                    </div>

                    <div className="pt-1 sm:pt-2">
                        <DividerText text={t.auth.login.orContinueWith} className="text-xs sm:text-sm" />
                        <SocialLoginButtons />
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}

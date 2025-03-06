"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { DividerText } from "@/components/ui/divider-text";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/client";

type LoginFormProps = {
    error: string | undefined;
};

const formSchema = z.object({
    contactMethod: z.enum(["email", "phone"]),
    contact: z.string().min(1, { message: t.auth.errors.requiredField })
});

export default function LoginForm({ error }: LoginFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(error || "");
    const [requestInProgress, setRequestInProgress] = useState(false);
    const supabase = createClient();

    const emailButtonRef = useRef<HTMLButtonElement>(null);
    const phoneButtonRef = useRef<HTMLButtonElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contactMethod: "email",
            contact: ""
        }
    });

    const contactMethod = form.watch("contactMethod");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Prevent duplicate submissions
        if (requestInProgress) return;

        setFormError("");

        const { contactMethod, contact } = values;

        // Additional validation for email format
        if (contactMethod === "email") {
            const emailSchema = z.string().email({ message: t.auth.errors.invalidEmail });
            const validationResult = emailSchema.safeParse(contact);

            if (!validationResult.success) {
                setFormError(validationResult.error.errors[0].message);
                return;
            }
        }

        setIsSubmitting(true);
        setRequestInProgress(true);

        try {
            let result;

            if (contactMethod === "email") {
                result = await supabase.auth.signInWithOtp({
                    email: contact,
                    options: {
                        shouldCreateUser: true
                    }
                });
            } else {
                result = await supabase.auth.signInWithOtp({
                    phone: contact,
                    options: {
                        shouldCreateUser: true
                    }
                });
            }

            if (result.error) {
                setFormError(result.error.message);
                setRequestInProgress(false);
            } else {
                // Store contact info securely in a cookie instead of URL params
                document.cookie = `auth_contact=${encodeURIComponent(contact)}; max-age=300; path=/; Secure; SameSite=Strict`;
                document.cookie = `auth_method=${contactMethod}; max-age=300; path=/; Secure; SameSite=Strict`;

                // Redirect without sensitive params in URL
                window.location.href = `/otp`;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t.auth.errors.serverError;
            setFormError(errorMessage);
            setRequestInProgress(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title={t.auth.login.title} subtitle={t.auth.login.subtitle}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-4 w-full">
                    <div className="space-y-5 sm:space-y-4" data-page="login">
                        {formError && (
                            <div className="error-message text-base sm:text-sm">
                                <span>{formError}</span>
                            </div>
                        )}

                        <div className="relative">
                            <div className="flex justify-center gap-2 overflow-hidden">
                                <button
                                    ref={emailButtonRef}
                                    type="button"
                                    onClick={() => {
                                        form.setValue("contactMethod", "email");
                                        form.setValue("contact", "");
                                        if (formError) setFormError("");
                                    }}
                                    className={`
                                        flex-1 py-2.5 sm:py-1.5 px-4 rounded-md
                                        text-base sm:text-sm font-medium transition-all duration-200
                                        ${
                                            contactMethod === "email"
                                                ? "bg-primary text-white shadow-sm"
                                                : "bg-secondary/50 text-foreground hover:bg-secondary/70"
                                        }
                                    `}
                                    aria-pressed={contactMethod === "email"}
                                >
                                    {t.auth.login.emailToggle}
                                </button>
                                <button
                                    ref={phoneButtonRef}
                                    type="button"
                                    onClick={() => {
                                        form.setValue("contactMethod", "phone");
                                        form.setValue("contact", "");
                                        if (formError) setFormError("");
                                    }}
                                    className={`
                                        flex-1 py-2.5 sm:py-1.5 px-4 rounded-md
                                        text-base sm:text-sm font-medium transition-all duration-200
                                        ${
                                            contactMethod === "phone"
                                                ? "bg-primary text-white shadow-sm"
                                                : "bg-secondary/50 text-foreground hover:bg-secondary/70"
                                        }
                                    `}
                                    aria-pressed={contactMethod === "phone"}
                                >
                                    {t.auth.login.phoneToggle}
                                </button>
                            </div>
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
                                                className="text-left shadow-sm text-base sm:text-sm h-12 sm:h-10"
                                                dir="ltr"
                                            />
                                        ) : (
                                            <div dir="ltr">
                                                <PhoneInput
                                                    {...field}
                                                    placeholder={t.auth.login.phonePlaceholder}
                                                    className="shadow-sm text-base sm:text-sm h-12 sm:h-10"
                                                    onChange={(value) => {
                                                        if (formError) setFormError("");
                                                        field.onChange(value);
                                                    }}
                                                    error={formError}
                                                    setError={setFormError}
                                                />
                                            </div>
                                        )}
                                    </FormControl>
                                    <FormMessage className="text-sm sm:text-xs" />
                                </FormItem>
                            )}
                        />

                        <div>
                            <AuthButton
                                type="submit"
                                isLoading={isSubmitting}
                                loadingText={t.auth.login.sendingCode}
                                className="h-12 sm:h-10 text-base sm:text-sm"
                            >
                                {t.auth.login.submitButton}
                            </AuthButton>
                        </div>
                    </div>

                    <div className="pt-2">
                        <DividerText text={t.auth.login.orContinueWith} className="text-sm sm:text-xs" />
                        <SocialLoginButtons />
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}

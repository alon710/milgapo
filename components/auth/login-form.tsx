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

// Define the form schema
const formSchema = z
    .object({
        contactMethod: z.enum(["email", "phone"]),
        contact: z.string().min(1, { message: t.auth.errors.requiredField })
    })
    .refine(
        (data) => {
            if (data.contactMethod === "email") {
                // Validate email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact);
            } else {
                // Only validate phone number if not empty
                return data.contact === "" || isValidPhoneNumber(data.contact);
            }
        },
        (data) => ({
            message: data.contactMethod === "email" ? t.auth.errors.invalidEmail : t.auth.errors.invalidPhone,
            path: ["contact"]
        })
    );

export default function LoginForm({ error }: LoginFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(error || "");

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contact: "",
            contactMethod: "email"
        },
        mode: "onBlur" // Only validate on blur, not on change
    });

    const contactMethod = form.watch("contactMethod");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { contact, contactMethod } = values;
        setFormError("");
        setIsSubmitting(true);

        // Final validation check for phone numbers
        if (contactMethod === "phone" && !isValidPhoneNumber(contact)) {
            setFormError(t.auth.errors.invalidPhone);
            setIsSubmitting(false);
            return;
        }

        const supabase = await createClient();
        const options = { shouldCreateUser: true };

        try {
            console.log("contactMethod", contactMethod);
            console.log("contact", contact);
            const { error: authError } =
                contactMethod === "email"
                    ? await supabase.auth.signInWithOtp({ email: contact, options })
                    : await supabase.auth.signInWithOtp({ phone: contact, options });

            if (authError) {
                setFormError(authError.message);
                setIsSubmitting(false);
                return;
            }

            window.location.href = `/otp?contact=${encodeURIComponent(contact)}&method=${contactMethod}`;
        } catch (error) {
            setFormError(error instanceof Error ? error.message : t.auth.errors.serverError);
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title={t.auth.login.title} subtitle={t.auth.login.subtitle}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <div className="space-y-6" data-page="login">
                        {formError && <div className="error-message">{formError}</div>}

                        <div>
                            <ToggleGroup
                                type="single"
                                value={contactMethod}
                                onValueChange={(value) => {
                                    if (value) {
                                        form.setValue("contactMethod", value as "email" | "phone");
                                        form.setValue("contact", "");
                                        form.clearErrors("contact");
                                        setFormError("");
                                    }
                                }}
                                className="flex mb-6 w-full rtl shadow-sm"
                            >
                                <ToggleGroupItem
                                    value="email"
                                    className="flex-1 px-4 py-3 border rounded-e text-sm hover:bg-secondary/50 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:font-normal"
                                >
                                    {t.auth.login.emailToggle}
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="phone"
                                    className="flex-1 px-4 py-3 border rounded-s text-sm hover:bg-secondary/50 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:font-normal"
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
                                                className="text-left shadow-sm"
                                                dir="ltr"
                                            />
                                        ) : (
                                            <div dir="ltr">
                                                <PhoneInput
                                                    {...field}
                                                    defaultCountry="IL"
                                                    placeholder={t.auth.login.phonePlaceholder}
                                                    className="shadow-sm"
                                                    onChange={(value) => {
                                                        // Clear previous error when changing
                                                        if (formError) setFormError("");
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <AuthButton type="submit" isLoading={isSubmitting} loadingText={t.auth.login.sendingCode}>
                                {t.auth.login.submitButton}
                            </AuthButton>
                        </div>
                    </div>

                    <div className="pt-2">
                        <DividerText text={t.auth.login.orContinueWith} />
                        <SocialLoginButtons />
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}

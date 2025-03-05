"use client";

import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

import { signInAction } from "@/app/actions";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { L } from "@/config/language";

type LoginFormProps = {
    description: JSX.Element;
    error: string | undefined;
};

export default function LoginForm({ description, error }: LoginFormProps) {
    const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
    const [contact, setContact] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { id: "login-error" });
        }
    }, [error]);

    async function handleSubmit() {
        await signInAction({ contact, method: contactMethod });
    }

    return (
        <AuthFormLayout
            title={L.auth.LoginButtonText}
            description={description}
            submitAction={handleSubmit}
            buttonText={L.auth.LoginButtonText}
            pendingText={L.auth.LoginButtonPendingText}
        >
            <ToggleGroup
                type="single"
                value={contactMethod}
                onValueChange={(value) => value && setContactMethod(value as "email" | "phone")}
                className="flex mb-4 w-full"
            >
                <ToggleGroupItem value="phone" className="flex-1 px-4 py-1 border rounded-e">
                    {L.auth.phone}
                </ToggleGroupItem>
                <ToggleGroupItem value="email" className="flex-1 px-4 py-1 border rounded-s">
                    {L.auth.email}
                </ToggleGroupItem>
            </ToggleGroup>
            <Label htmlFor="contact">{contactMethod === "email" ? L.auth.email : L.auth.phone}</Label>
            <Input
                id="contact"
                name="contact"
                type={contactMethod === "email" ? "email" : "tel"}
                placeholder={contactMethod === "email" ? "email@example.com" : "0505625810"}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
            />
        </AuthFormLayout>
    );
}

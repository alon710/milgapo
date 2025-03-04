import { JSX } from "react";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { SubmitButton } from "@/components/submit-button";

type FormAction = (formData: FormData) => Promise<void>;

type AuthFormLayoutProps = {
    title: string;
    description: JSX.Element;
    submitAction: FormAction;
    buttonText: string;
    pendingText: string;
    children: React.ReactNode;
    containerClassName?: string;
};

export function AuthFormLayout({
    title,
    description,
    submitAction,
    buttonText,
    pendingText,
    children,
    containerClassName = "flex flex-col min-w-64"
}: AuthFormLayoutProps) {
    return (
        <form className={containerClassName}>
            <h1 className="text-2xl font-medium">{title}</h1>
            <div className="text-sm text-foreground">{description}</div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                {children}
                <SubmitButton formAction={submitAction} pendingText={pendingText}>
                    {buttonText}
                </SubmitButton>
                <SocialLoginButtons />
            </div>
        </form>
    );
}

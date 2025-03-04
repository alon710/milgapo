// components/auth/submit-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({
    children,
    pendingText,
    formAction,
    className = "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
}: {
    children: React.ReactNode;
    pendingText: string;
    formAction: (formData: FormData) => Promise<void>;
    className?: string;
}) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" aria-disabled={pending} formAction={formAction} className={className}>
            {pending ? pendingText : children}
        </Button>
    );
}

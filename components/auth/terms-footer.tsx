"use client";

import Link from "next/link";

import { t } from "@/config/languages";

export function TermsFooter() {
    return (
        <div className="mt-6 text-center text-xs text-muted-foreground">
            <span>
                {t.auth.login.termsAgreement.split("תנאי השימוש")[0]}
                <Link href="/terms" className="underline hover:text-primary">
                    {t.auth.login.termsLink}
                </Link>{" "}
                {t.auth.login.termsAgreement.split("תנאי השימוש")[1].split("מדיניות הפרטיות")[0]}
                <Link href="/privacy" className="underline hover:text-primary">
                    {t.auth.login.privacyLink}
                </Link>
                {t.auth.login.termsAgreement.split("מדיניות הפרטיות")[1]}
            </span>
        </div>
    );
}

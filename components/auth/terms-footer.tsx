"use client";

import Link from "next/link";

import { t } from "@/config/languages";

export function TermsFooter() {
    return (
        <div className="mt-6 text-center text-xs text-muted-foreground">
            <span>
                {t.auth.login.termsAgreement.before}
                <Link href="/terms" className="underline hover:text-primary">
                    {t.auth.login.termsLink}
                </Link>
                {t.auth.login.termsAgreement.middle}
                <Link href="/privacy" className="underline hover:text-primary">
                    {t.auth.login.privacyLink}
                </Link>
                {t.auth.login.termsAgreement.after}
            </span>
        </div>
    );
}

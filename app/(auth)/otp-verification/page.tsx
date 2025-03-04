import React, { Suspense } from "react";

import OTPVerificationForm from "@/components/auth/otp-verification-form";

export default function OTPVerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPVerificationForm />
        </Suspense>
    );
}

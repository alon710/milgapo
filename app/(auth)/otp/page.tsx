import React, { Suspense } from "react";

import OtpForm from "@/components/auth/otp-form";

function OtpFormLoader() {
    return (
        <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}

export default function OtpPage() {
    return (
        <Suspense fallback={<OtpFormLoader />}>
            <OtpForm />
        </Suspense>
    );
}

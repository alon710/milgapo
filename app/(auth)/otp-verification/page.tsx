import { redirect } from "next/navigation";

export default function OTPVerificationPage({ searchParams }: { searchParams: { contact?: string; method?: string } }) {
    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString();
    redirect(`/otp${queryString ? "?" + queryString : ""}`);
}

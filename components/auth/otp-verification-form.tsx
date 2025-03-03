"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const method = (searchParams.get("method") as "email" | "phone") || "email";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const supabase = await createClient();

    let result;
    if (method === "email") {
      result = await supabase.auth.verifyOtp({
        email: contact,
        token: otp,
        type: "email",
      });
    } else {
      result = await supabase.auth.verifyOtp({
        phone: contact,
        token: otp,
        type: "sms",
      });
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md w-full p-4"
    >
      <h1 className="text-2xl font-medium">OTP Verification</h1>
      <p>Please enter the OTP sent to {contact}</p>
      {error && <p className="text-red-500">{error}</p>}
      <Label htmlFor="otp">OTP Code</Label>
      <Input
        id="otp"
        name="otp"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );
}

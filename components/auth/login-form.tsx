"use client";

import { JSX, useState } from "react";
import { signInAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Message } from "@/components/form-message";

type LoginFormProps = {
  description: JSX.Element;
  searchParams: Message;
};

export default function LoginForm({
  description,
  searchParams,
}: LoginFormProps) {
  const [contactMethod, setContactMethod] = useState<"email" | "phone">(
    "email"
  );
  const [contact, setContact] = useState("");

  async function handleSubmit() {
    await signInAction({ contact, method: contactMethod });
  }

  return (
    <AuthFormLayout
      title="Sign in"
      description={description}
      submitAction={handleSubmit}
      buttonText="Sign in"
      pendingText="Sending OTP..."
      message={searchParams}
    >
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setContactMethod("email")}
          className={`px-4 py-2 border rounded ${
            contactMethod === "email" ? "bg-gray-300" : "bg-transparent"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setContactMethod("phone")}
          className={`px-4 py-2 border rounded ${
            contactMethod === "phone" ? "bg-gray-300" : "bg-transparent"
          }`}
        >
          Phone
        </button>
      </div>
      <Label htmlFor="contact">
        {contactMethod === "email" ? "Email" : "Phone"}
      </Label>
      <Input
        id="contact"
        name="contact"
        type={contactMethod === "email" ? "email" : "tel"}
        placeholder={
          contactMethod === "email" ? "you@example.com" : "1234567890"
        }
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
    </AuthFormLayout>
  );
}

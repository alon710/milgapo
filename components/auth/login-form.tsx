"use client";

import { JSX, useState } from "react";
import { signInAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Message } from "@/components/form-message";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      <ToggleGroup
        type="single"
        value={contactMethod}
        onValueChange={(value) =>
          value && setContactMethod(value as "email" | "phone")
        }
        className="flex mb-4 w-full"
      >
        <ToggleGroupItem
          value="email"
          className={`flex-1 px-4 py-1 border rounded-l ${
            contactMethod === "email" ? "bg-gray-300" : "bg-transparent"
          }`}
        >
          Email
        </ToggleGroupItem>
        <ToggleGroupItem
          value="phone"
          className={`flex-1 px-4 py-1 border rounded-r ${
            contactMethod === "phone" ? "bg-gray-300" : "bg-transparent"
          }`}
        >
          Phone
        </ToggleGroupItem>
      </ToggleGroup>
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

"use client";

import { JSX, useState } from "react";
import { signInAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Message } from "@/components/form-message";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { authConfig } from "@/config/auth";

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
      title={authConfig.LoginButtonTitle}
      description={description}
      submitAction={handleSubmit}
      buttonText={authConfig.LoginButtonText}
      pendingText={authConfig.LoginButtonPendingText}
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
          {authConfig.email}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="phone"
          className={`flex-1 px-4 py-1 border rounded-r ${
            contactMethod === "phone" ? "bg-gray-300" : "bg-transparent"
          }`}
        >
          {authConfig.phone}
        </ToggleGroupItem>
      </ToggleGroup>
      <Label htmlFor="contact">
        {contactMethod === "email" ? authConfig.email : authConfig.phone}
      </Label>
      <Input
        id="contact"
        name="contact"
        type={contactMethod === "email" ? "email" : "tel"}
        placeholder={
          contactMethod === "email" ? "email@example.com" : "0505625810"
        }
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
    </AuthFormLayout>
  );
}

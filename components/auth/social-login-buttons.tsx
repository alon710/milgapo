"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { authConfig } from "@/config/auth";
interface SocialLoginButtonProps {
  provider: "google" | "facebook";
  onClick: () => void;
}

export function SocialLoginButton({
  provider,
  onClick,
}: SocialLoginButtonProps) {
  const { icon, text, className } = (() => {
    if (provider === "google") {
      return {
        icon: <FcGoogle className="mx-1" />,
        text: authConfig.google,
        className:
          "bg-white text-black border border-gray-300 hover:bg-gray-100 font-sans",
      };
    } else if (provider === "facebook") {
      return {
        icon: <FaFacebookF className="mx-1" />,
        text: authConfig.facebook,
        className: "bg-[#1877F2] text-white hover:bg-blue-600 font-sans",
      };
    }
    return { icon: null, text: "", className: "" };
  })();

  return (
    <Button type="button" onClick={onClick} className={className}>
      {icon}
      {text}
    </Button>
  );
}

export function SocialLoginButtons() {
  async function handleSocialSignIn(provider: "google" | "facebook") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (data.url) {
      redirect(data.url);
    }

    if (error) {
      return;
    }
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        <span className="px-2 text-gray-500 dark:text-gray-400">
          {authConfig.orContinueWith}
        </span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialSignIn("google")}
        />
        <SocialLoginButton
          provider="facebook"
          onClick={() => handleSocialSignIn("facebook")}
        />
      </div>
    </div>
  );
}

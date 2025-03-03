"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";

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
        icon: <FcGoogle className="mr-2" />,
        text: "Google",
        className:
          "bg-white text-black border border-gray-300 hover:bg-gray-100",
      };
    } else if (provider === "facebook") {
      return {
        icon: <FaFacebookF className="mr-2" />,
        text: "Facebook",
        className: "bg-[#1877F2] text-white hover:bg-blue-600",
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(`${provider} sign in error:`, error.message);
      return;
    }
    console.log(`${provider} sign in initiated`);
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        <span className="px-2 text-gray-500 dark:text-gray-400">
          Or continue with
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

"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";

export function SocialLoginButtons() {
  async function handleGoogleSignIn() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google sign in error:", error.message);
      return;
    }
    console.log("Google sign in initiated");
  }

  async function handleFacebookSignIn() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Facebook sign in error:", error.message);
      return;
    }
    console.log("Facebook sign in initiated");
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
        <Button type="button" onClick={handleGoogleSignIn}>
          <FcGoogle className="mr-2" />
          Google
        </Button>
        <Button type="button" onClick={handleFacebookSignIn}>
          <FaFacebookF className="mr-2" />
          Facebook
        </Button>
      </div>
    </div>
  );
}

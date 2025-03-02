"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export function SocialLoginButtons() {
  async function handleGoogleSignIn() {
    // TODO: Replace with your actual Google login action.
    console.log("Google sign in");
  }

  async function handleFacebookSignIn() {
    // TODO: Replace with your actual Facebook login action.
    console.log("Facebook sign in");
  }

  return (
    <div>
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
      Or continue with
    </span>
  </div>
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

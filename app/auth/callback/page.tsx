"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function finalizeAuth() {
      const supabase = createClient();
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error finalizing session:", error.message);
      } else {
        router.push("/dashboard");
      }
    }
    finalizeAuth();
  }, [router]);

  return <div>Finalizing authentication...</div>;
}

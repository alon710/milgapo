import { signInAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { CredentialFields } from "@/components/auth/credential-fields";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { Message } from "@/components/form-message";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  // Ensure the promise is resolved
  const searchParams = await props.searchParams;
  const description = (
    <>
      Create an account{" "}
      <Link className="text-foreground font-medium underline" href="/sign-up">
        Sign up
      </Link>
    </>
  );

  return (
    <div className="flex flex-col gap-8">
      <AuthFormLayout
        title="Sign in"
        description={description}
        submitAction={signInAction}
        buttonText="Sign in"
        pendingText="Signing In..."
        message={searchParams}
      >
        <CredentialFields includeForgotPassword={true} />
      </AuthFormLayout>
    </div>
  );
}

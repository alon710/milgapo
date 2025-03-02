import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type CredentialFieldsProps = {
  includeForgotPassword?: boolean;
  minPasswordLength?: number;
};

export function CredentialFields({
  includeForgotPassword = false,
  minPasswordLength = 6,
}: CredentialFieldsProps) {
  return (
    <>
      <Label htmlFor="email">Email</Label>
      <Input name="email" placeholder="you@example.com" required />
      <div className="flex justify-between items-center">
        <Label htmlFor="password">Password</Label>
        {includeForgotPassword && (
          <Link className="text-xs text-foreground underline" href="/forgot-password">
            Forgot Password?
          </Link>
        )}
      </div>
      <Input
        type="password"
        name="password"
        placeholder="Your password"
        minLength={minPasswordLength}
        required
      />
    </>
  );
}

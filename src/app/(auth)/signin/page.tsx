import type { Metadata } from "next";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <SignInForm />
    </div>
  );
}

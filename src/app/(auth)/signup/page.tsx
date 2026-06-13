import type { Metadata } from "next";
import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <SignUpForm />
    </div>
  );
}

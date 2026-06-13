import type { Metadata } from "next";
import { BookForm } from "@/components/forms/book-form";

export const metadata: Metadata = {
  title: "本を登録",
};

export default function NewBookPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <BookForm />
    </div>
  );
}

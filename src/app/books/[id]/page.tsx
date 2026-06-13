import type { Metadata } from "next";
import { BookDetailClient } from "@/components/books/book-detail-client";

export const metadata: Metadata = {
  title: "本の詳細",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-4xl mx-auto">
      <BookDetailClient bookId={id} />
    </div>
  );
}

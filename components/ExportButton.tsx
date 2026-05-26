"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types";

type Props = {
  books: Book[];
  selectedIds: Set<string>;
};

export default function ExportButton({ books, selectedIds }: Props) {
  const [loading, setLoading] = useState(false);

  const selectedBooks = books.filter((b) => selectedIds.has(b.id));
  const count = selectedBooks.length;

  async function handleExport() {
    if (count === 0) return;
    setLoading(true);
    try {
      const { exportBooksToXlsx } = await import("@/lib/export");
      await exportBooksToXlsx(selectedBooks);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={count === 0 || loading}
      variant="default"
      className="w-full"
    >
      {loading
        ? "מייצא…"
        : count === 0
        ? "ייצוא (בחר ספרים תחילה)"
        : `ייצוא ${count} ספרים לקובץ XLSX`}
    </Button>
  );
}

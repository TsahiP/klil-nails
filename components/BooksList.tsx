"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Book } from "@/lib/types";

type Props = {
  books: Book[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  viewingBookId: string | null;
  onViewBook: (id: string | null) => void;
};

export default function BooksList({
  books,
  selectedIds,
  onToggle,
  onToggleAll,
  viewingBookId,
  onViewBook,
}: Props) {
  if (books.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-6">
        No books yet. Fill your first book to see it here.
      </p>
    );
  }

  const allSelected = books.length > 0 && selectedIds.size === books.length;

  const viewingBook = books.find((b) => b.id === viewingBookId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Select all toggle */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onToggleAll}
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium cursor-pointer select-none"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </label>
      </div>

      <Separator />

      {/* Book rows */}
      <div className="flex flex-col gap-2">
        {books.map((book, idx) => {
          const isSelected = selectedIds.has(book.id);
          const isViewing = viewingBookId === book.id;
          return (
            <div
              key={book.id}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                isViewing ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Checkbox
                id={`book-${book.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggle(book.id)}
              />
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => onViewBook(isViewing ? null : book.id)}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    Book #{idx + 1} — starts{" "}
                    <span className="font-mono">{book.starterInvoiceNumber}</span>
                  </span>
                  <Badge variant={isViewing ? "default" : "secondary"}>
                    {book.invoices.length}/{book.totalInvoices}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Inline book detail view */}
      {viewingBook && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-semibold mb-3">
              Book #{books.findIndex((b) => b.id === viewingBook.id) + 1} —
              Invoices
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingBook.invoices.map((inv) => (
                  <TableRow key={inv.invoiceNumber}>
                    <TableCell>{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell className="text-right">
                      {inv.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}

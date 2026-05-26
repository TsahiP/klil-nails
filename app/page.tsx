"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import BookSetupForm from "@/components/BookSetupForm";
import InvoiceForm from "@/components/InvoiceForm";
import BooksList from "@/components/BooksList";
import ExportButton from "@/components/ExportButton";
import { Separator } from "@/components/ui/separator";
import { loadBooks, saveBooks } from "@/lib/storage";
import type { Book, Invoice } from "@/lib/types";

type View = "setup" | "invoices";
type MobileTab = "form" | "books";

type BookSetup = {
  totalInvoices: number;
  starterInvoiceNumber: string;
};

export default function Home() {
  const [view, setView] = useState<View>("setup");
  const [books, setBooks] = useState<Book[]>([]);

  // Load persisted books after hydration to avoid server/client HTML mismatch
  useEffect(() => {
    setBooks(loadBooks());
  }, []);
  const [activeSetup, setActiveSetup] = useState<BookSetup | null>(null);
  const [currentInvoices, setCurrentInvoices] = useState<Invoice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingBookId, setViewingBookId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");

  function handleSetupSubmit(setup: BookSetup) {
    setActiveSetup(setup);
    setCurrentInvoices([]);
    setCurrentIndex(0);
    setView("invoices");
    setMobileTab("form");
  }

  function handleNextInvoice(invoice: Invoice) {
    const updated = [...currentInvoices, invoice];
    const nextIndex = currentIndex + 1;

    if (nextIndex >= activeSetup!.totalInvoices) {
      const newBook: Book = {
        id: crypto.randomUUID(),
        starterInvoiceNumber: activeSetup!.starterInvoiceNumber,
        totalInvoices: activeSetup!.totalInvoices,
        createdAt: new Date().toISOString(),
        invoices: updated,
      };
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      saveBooks(updatedBooks);
      setCurrentInvoices([]);
      setCurrentIndex(0);
      setActiveSetup(null);
      setView("setup");
      // Switch to books tab so the user sees the newly saved book
      setMobileTab("books");
    } else {
      setCurrentInvoices(updated);
      setCurrentIndex(nextIndex);
    }
  }

  const handleToggleBook = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === books.length
        ? new Set()
        : new Set(books.map((b) => b.id))
    );
  }, [books]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">ספרים קודמים</h2>
        {books.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {books.length} ספרים
          </span>
        )}
      </div>
      <BooksList
        books={books}
        selectedIds={selectedIds}
        onToggle={handleToggleBook}
        onToggleAll={handleToggleAll}
        viewingBookId={viewingBookId}
        onViewBook={setViewingBookId}
      />
      {books.length > 0 && (
        <>
          <Separator />
          <ExportButton books={books} selectedIds={selectedIds} />
        </>
      )}
    </>
  );

  const formContent = (
    <div className="w-full max-w-md mx-auto">
      {view === "setup" && <BookSetupForm onSubmit={handleSetupSubmit} />}
      {view === "invoices" && activeSetup && (
        <InvoiceForm
          key={currentIndex}
          currentIndex={currentIndex}
          totalInvoices={activeSetup.totalInvoices}
          starterInvoiceNumber={activeSetup.starterInvoiceNumber}
          onNext={handleNextInvoice}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 sm:px-6 sm:py-4 shrink-0 flex items-center gap-3">
        <Image
          src="/logo.jpeg"
          alt="לוגו"
          width={40}
          height={40}
          className="rounded-full object-cover shrink-0"
        />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          ספרי חשבוניות
        </h1>
      </header>

      {/* Mobile tab bar */}
      <nav className="lg:hidden flex border-b bg-card shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("form")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "form"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          {view === "invoices" ? "מילוי חשבונית" : "ספר חדש"}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("books")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "books"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          ספרים
          {books.length > 0 && (
            <span className="mr-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {books.length}
            </span>
          )}
        </button>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: side-by-side | Mobile: tabs */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
            mobileTab === "books" ? "hidden lg:flex" : "flex"
          } items-start justify-center`}
        >
          {formContent}
        </main>

        <Separator orientation="vertical" className="hidden lg:block shrink-0" />

        <aside
          className={`lg:w-96 lg:flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto bg-card shrink-0 w-full ${
            mobileTab === "books" ? "flex" : "hidden lg:flex"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </div>
  );
}

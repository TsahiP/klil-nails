import type { Book } from "./types";

const STORAGE_KEY = "invoice_books";

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function addBook(book: Book): void {
  const books = loadBooks();
  saveBooks([...books, book]);
}

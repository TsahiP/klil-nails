import type { Book } from "./types";

export async function exportBooksToXlsx(books: Book[]): Promise<void> {
  const XLSX = await import("xlsx");

  const rows: (string | number)[][] = [];

  books.forEach((book, idx) => {
    if (idx > 0) rows.push([]);

    rows.push([
      `Book: starts #${book.starterInvoiceNumber}, ${book.totalInvoices} invoices`,
      "",
      "",
      "",
    ]);
    rows.push(["Invoice #", "Date", "Price", ""]);

    book.invoices.forEach((inv) => {
      rows.push([inv.invoiceNumber, inv.date, inv.price, ""]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 4 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");

  XLSX.writeFile(wb, "invoices.xlsx");
}

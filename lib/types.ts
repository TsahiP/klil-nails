export type Invoice = {
  invoiceNumber: string;
  date: string;
  price: number;
};

export type Book = {
  id: string;
  starterInvoiceNumber: string;
  totalInvoices: number;
  createdAt: string;
  invoices: Invoice[];
};

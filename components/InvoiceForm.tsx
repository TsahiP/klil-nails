"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/lib/types";

type Props = {
  currentIndex: number;
  totalInvoices: number;
  starterInvoiceNumber: string;
  onNext: (invoice: Invoice) => void;
};

/** Increments the trailing numeric part of a string.
 *  "1/1" + 2  → "1/3"
 *  "100" + 3  → "103"
 *  "ABC"  + 1 → "ABC"  (no numeric suffix, return as-is)
 */
function incrementInvoiceNumber(starter: string, offset: number): string {
  const match = starter.match(/^(.*?)(\d+)$/);
  if (!match) return starter;
  const prefix = match[1];
  const base = parseInt(match[2], 10);
  return prefix + (base + offset);
}

export default function InvoiceForm({
  currentIndex,
  totalInvoices,
  starterInvoiceNumber,
  onNext,
}: Props) {
  // State is initialized once per mount. The parent passes key={currentIndex}
  // to remount this component fresh for each invoice.
  const [invoiceNumber, setInvoiceNumber] = useState(
    incrementInvoiceNumber(starterInvoiceNumber, currentIndex)
  );
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [price, setPrice] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!invoiceNumber.trim() || !parsedPrice || parsedPrice < 0) return;
    onNext({
      invoiceNumber: invoiceNumber.trim(),
      date,
      price: parsedPrice,
    });
  }

  const isLast = currentIndex === totalInvoices - 1;
  const progress = currentIndex + 1;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Invoice Details</CardTitle>
        <Badge variant="secondary">
          {progress} / {totalInvoices}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${(progress / totalInvoices) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              type="text"
              placeholder="e.g. 100 or 100/1"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-1">
            {isLast ? "Finish Book" : "Next Invoice →"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

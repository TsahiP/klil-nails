"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type BookSetup = {
  totalInvoices: number;
  starterInvoiceNumber: string;
};

type Props = {
  onSubmit: (setup: BookSetup) => void;
};

export default function BookSetupForm({ onSubmit }: Props) {
  const [totalInvoices, setTotalInvoices] = useState("");
  const [starterInvoiceNumber, setStarterInvoiceNumber] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const total = parseInt(totalInvoices, 10);
    if (!total || total < 1 || !starterInvoiceNumber.trim()) return;
    onSubmit({ totalInvoices: total, starterInvoiceNumber: starterInvoiceNumber.trim() });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">New Invoice Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalInvoices">Number of invoices in book</Label>
            <Input
              id="totalInvoices"
              type="number"
              min={1}
              placeholder="e.g. 8"
              value={totalInvoices}
              onChange={(e) => setTotalInvoices(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="starterInvoiceNumber">Starting invoice number</Label>
            <Input
              id="starterInvoiceNumber"
              type="text"
              placeholder="e.g. 100 or 1/1"
              value={starterInvoiceNumber}
              onChange={(e) => setStarterInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-1">
            Start Filling Invoices
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

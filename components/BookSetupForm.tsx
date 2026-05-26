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
        <CardTitle className="text-xl">ספר חשבוניות חדש</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalInvoices">מספר חשבוניות בספר</Label>
            <Input
              id="totalInvoices"
              type="number"
              min={1}
              placeholder="לדוגמה: 8"
              value={totalInvoices}
              onChange={(e) => setTotalInvoices(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="starterInvoiceNumber">מספר חשבונית התחלתי</Label>
            <Input
              id="starterInvoiceNumber"
              type="text"
              placeholder="לדוגמה: 100 או 1/1"
              value={starterInvoiceNumber}
              onChange={(e) => setStarterInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-1">
            התחל מילוי חשבוניות
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

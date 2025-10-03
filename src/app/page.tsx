"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LabelForm from "@/components/pharma-guide/label-form";
import LabelPreview from "@/components/pharma-guide/label-preview";

export type LabelState = {
  serial: string;
  patientName: string;
  date: Date;
  shakeMode: "with" | "without";
  drops: number;
  shakeCount: number;
  interval: number;
  counseling: string;
};

export default function Home() {
  const [labelState, setLabelState] = useState<LabelState>({
    serial: "1",
    patientName: "মোঃ আবদুর রহিম",
    date: new Date(),
    shakeMode: "with",
    drops: 2,
    shakeCount: 10,
    interval: 6,
    counseling: "খাবারের ৩০ মিনিট পর সেবন করুন।\nআলো থেকে দূরে রাখুন।",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              ঔষধ নির্দেশিকা জেনারেটর
            </h1>
            <p className="text-muted-foreground mt-1">
              প্রয়োজনীয় তথ্য দিয়ে ঔষধের লেবেল তৈরি এবং প্রিন্ট করুন।
            </p>
          </div>
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            প্রিন্ট করুন
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">তথ্য প্রদান করুন</CardTitle>
              <CardDescription>
                লেবেল তৈরি করতে নিচের ফর্মটি পূরণ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LabelForm state={labelState} setState={setLabelState} />
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
             <LabelPreview {...labelState} />
          </div>
        </div>
      </div>
    </main>
  );
}

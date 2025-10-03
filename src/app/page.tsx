"use client";

import { useState, useEffect } from "react";
import { Printer, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LabelForm from "@/components/pharma-guide/label-form";
import LabelPreview from "@/components/pharma-guide/label-preview";
import { convertToBanglaNumerals } from "@/lib/utils";

export type LabelState = {
  serial: string;
  patientName: string;
  date: Date;
  shakeMode: "with" | "without";
  drops: number;
  shakeCount: number;
  interval: number;
  counseling: string;
  instructionText: string;
};

export default function Home() {
  const [labelState, setLabelState] = useState<LabelState>({
    serial: "MI. 244544",
    patientName: "Roy Shaon",
    date: new Date("2025-09-14"),
    shakeMode: "with",
    drops: 5,
    shakeCount: 5,
    interval: 8,
    counseling:
      "১. ঔষধ সেবনকালীন পেস্ট সহ যাবতীয় দেশী ও বিদেশী ঔষধ ব্যবহার নিষিদ্ধ।\n২. ঔষধ সেবনের আধাঘন্টা আগে ও পরে কোন প্রকার খাবার ও পানীয় গ্রহণ করবেন না (সাধারণ জল ব্যতীত)।\n৩. ৭ দিন পরে আবার সাক্ষাৎ করবেন।",
    instructionText: "",
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateInstructionText = () => {
      const { drops, interval, shakeCount, shakeMode } = labelState;
      const bnDrops = convertToBanglaNumerals(drops);
      const bnInterval = convertToBanglaNumerals(interval);
      const bnShakeCount = convertToBanglaNumerals(shakeCount);

      let defaultInstruction = "";
      if (shakeMode === "with") {
        defaultInstruction = `প্রতিবার ঔষধ সেবনের পূর্বে শিশিটিকে হাতের তালুর উপরে সাজে ${bnShakeCount} বার ঝাঁকি দিয়ে ${bnDrops} ফোঁটা ঔষধ এক কাপ জলে ভালোভাবে মিশিয়ে ${bnInterval} ঘন্টা পর পর মিশ্রণ থেকে এক চামচ করে সেবন করুন।`;
      } else {
        defaultInstruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ফোঁটা ঔষধ এক কাপ জলে ভালোভাবে মিশিয়ে ${bnInterval} ঘন্টা পর পর মিশ্রণ থেকে এক চামচ করে সেবন করুন।`;
      }
      setLabelState((prevState) => ({
        ...prevState,
        instructionText: defaultInstruction,
      }));
    };
    updateInstructionText();
  }, [
    labelState.drops,
    labelState.interval,
    labelState.shakeCount,
    labelState.shakeMode,
  ]);


  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = () => {
    // This function can be used to trigger regeneration if needed,
    // but the preview updates live.
    console.log("Generating with state:", labelState);
  }

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-indigo-700">
              ঔষধ নির্দেশিকা জেনারেটর
            </h1>
            <p className="text-muted-foreground mt-1">
              প্রয়োজনীয় তথ্য দিয়ে ঔষধের লেবেল তৈরি এবং প্রিন্ট করুন।
            </p>
          </div>
          <Button onClick={handlePrint} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
            <Printer className="mr-2 h-4 w-4" />
            প্রিন্ট করুন (3.75" x 5.5" লেবেল)
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">রোগীর তথ্য ও নির্দেশাবলী ইনপুট করুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <LabelForm state={labelState} setState={setLabelState} />
              <Button onClick={handleGenerate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50">
                ফর্ম তৈরি করুন এবং প্রিভিউ দেখুন
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">ফর্মের প্রিভিউ</h2>
              <p className="text-sm text-gray-500">নিচের ফরম্যাটটি প্রিন্ট লেবেলের মতো দেখাবে (3.75" x 5.5")।</p>
            </div>
             <LabelPreview {...labelState} />
          </div>
        </div>
      </div>
    </main>
  );
}

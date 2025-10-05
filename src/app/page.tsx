
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Printer, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  intervalUnit: "hours" | "days";
  mixtureAmount: string;
  mixtureNumber: string;
  durationDays: number;
  counseling: string[];
  labelCount: number;
  followUpDays: number;
  showAllPreviews: boolean;
};

export default function Home() {
  const router = useRouter();

  const [labelState, setLabelState] = useState<LabelState>({
    serial: "F/",
    patientName: "",
    date: new Date(),
    shakeMode: "with",
    drops: 3,
    shakeCount: 10,
    interval: 12,
    intervalUnit: "hours",
    mixtureAmount: "১ চামচ",
    mixtureNumber: "১ম",
    durationDays: 7,
    counseling: [],
    labelCount: 1,
    followUpDays: 7,
    showAllPreviews: false,
  });
  
  const [activeLabelIndex, setActiveLabelIndex] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);
  
  // Mocking user state as Firebase is removed
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<{} | null>({}); // Assume user is logged in


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Since Firebase is removed, we no longer need to check for a user session to redirect.
    // If you want to re-implement authentication, you would check for a session here.
    // For now, we assume the user is "logged in" and can access the page.
    if (!isUserLoading && !user) {
      // router.replace("/login"); // This can be re-enabled if auth is re-implemented
    }
  }, [isUserLoading, user, router]);
  

  useEffect(() => {
    const counselingParts = [
      "• ঔষধ সেবনকালীন যাবতীয় ঔষধি নিষিদ্ধ।",
      "• ঔষধ সেবনের আধা ঘন্টা আগে-পরে জল ব্যতিত কোন খাবার খাবেন না।",
      "• জরুরী প্রয়োজনে বিকাল ৫টা থেকে ৭টার মধ্যে ফোন করুন।"
    ];
    setLabelState(prevState => ({
      ...prevState,
      counseling: counselingParts
    }));
  }, []);
  
  useEffect(() => {
    const count = Number(labelState.labelCount);
    const currentCount = isNaN(count) || count < 1 ? 1 : count;
    
    if (activeLabelIndex > currentCount) {
      setActiveLabelIndex(currentCount);
    }
  }, [labelState.labelCount, activeLabelIndex]);

 const saveDataAndPrint = () => {
    // Data saving logic is removed as Firebase is no longer part of the project.
    // We will just trigger the print functionality.
    triggerPrint();
  };
  
  const triggerPrint = () => {
      const container = printContainerRef.current;
      if (!container) return;

      const printableContent = document.createElement('div');
      printableContent.id = 'printable-content';

      const previews = container.querySelectorAll('.printable-label-wrapper');

      previews.forEach(previewNode => {
        const sheet = document.createElement('div');
        sheet.className = "print-page";

        const content = previewNode.cloneNode(true) as HTMLElement;
        sheet.appendChild(content);

        printableContent.appendChild(sheet);
      });

      if (printableContent.hasChildNodes()) {
        document.body.appendChild(printableContent);
        window.print();
        document.body.removeChild(printableContent);
      }
  };


  if (!isClient || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const renderPreviews = () => {
    const count = Number(labelState.labelCount) || 1;
    if (labelState.showAllPreviews) {
      return Array.from({ length: count }, (_, i) => i + 1).map(index => (
        <div key={index} className="printable-label-wrapper mb-4">
          <LabelPreview {...labelState} activeLabelIndex={index} />
        </div>
      ));
    }
    return (
      <div className="printable-label-wrapper">
        <LabelPreview {...labelState} activeLabelIndex={activeLabelIndex} />
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-body text-indigo-700">
              ত্রিফুল আরোগ্য নিকেতন
            </h1>
            <p className="text-muted-foreground mt-1">
              প্রয়োজনীয় তথ্য দিয়ে ঔষধের লেবেল তৈরি এবং প্রিন্ট করুন।
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="font-body">রোগীর তথ্য ও নির্দেশাবলী</CardTitle>
            </CardHeader>
            <CardContent>
              <LabelForm 
                state={labelState} 
                setState={setLabelState} 
                activeLabelIndex={activeLabelIndex}
                setActiveLabelIndex={setActiveLabelIndex}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">ফর্মের প্রিভিউ</h2>
              <p className="text-sm text-gray-500">
                নিচের ফরম্যাটটি প্রিন্ট লেবেলের মতো দেখাবে ({convertToBanglaNumerals('3.6')}” x {convertToBanglaNumerals('5.6')}”)। 
                {!labelState.showAllPreviews && labelState.labelCount > 1 && ` মোট ${convertToBanglaNumerals(labelState.labelCount)}টি লেবেলের মধ্যে ${convertToBanglaNumerals(activeLabelIndex)} নং লেবেল দেখানো হচ্ছে।`}
              </p>
            </div>
             <div ref={printContainerRef}>
                {renderPreviews()}
              </div>

             <div className="text-center mt-6">
                <Button onClick={saveDataAndPrint} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-lg shadow-xl transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50">
                  <Printer className="mr-2 h-4 w-4" />
                  প্রিন্ট করুন
                </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

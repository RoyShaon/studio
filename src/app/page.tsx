
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Printer, Loader2, Trash2, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LabelForm from "@/components/pharma-guide/label-form";
import LabelPreview from "@/components/pharma-guide/label-preview";
import { convertToBanglaNumerals } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export type LabelState = {
  serial: string;
  patientName: string;
  date: Date;
  shakeMode: "with" | "without";
  drops: number | '';
  shakeCount: number | '';
  interval: number | '';
  intervalUnit: "hours" | "days";
  mixtureAmount: string;
  mixtureNumber: string;
  durationDays: number | '';
  counseling: string[];
  labelCount: number;
  followUpDays: number | '';
  showAllPreviews: boolean;
};

const defaultCounseling = [
  "• ঔষধ সেবনকালীন যাবতীয় ঔষধি নিষিদ্ধ।",
  "• ঔষধ সেবনের আধা ঘন্টা আগে-পরে জল ব্যতিত কোন খাবার খাবেন না।",
  "• জরুরী প্রয়োজনে বিকাল ৫টা থেকে ৭টার মধ্যে ফোন করুন।"
];

const defaultLabelState: LabelState = {
  serial: "F/",
  patientName: "",
  date: new Date(),
  shakeMode: "with",
  drops: 3,
  shakeCount: 10,
  interval: 12,
  intervalUnit: "hours",
  mixtureAmount: "১ চামচ ঔষধ",
  mixtureNumber: "১ম",
  durationDays: 7,
  counseling: defaultCounseling,
  labelCount: 1,
  followUpDays: 7,
  showAllPreviews: false,
};

export default function Home() {
  const router = useRouter();

  const [labelState, setLabelState] = useState<LabelState>(defaultLabelState);
  
  const [activeLabelIndex, setActiveLabelIndex] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);
  
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<{} | null>({});

  // Load state from local storage on initial render
  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem("pharmaLabelState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Ensure date is a Date object
        parsedState.date = new Date(parsedState.date);
        // If counseling is empty in saved state, set default
        if (!parsedState.counseling || parsedState.counseling.length === 0) {
          parsedState.counseling = defaultCounseling;
        }
        setLabelState(parsedState);
      }
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (isClient) {
      try {
        const stateToSave = JSON.stringify(labelState);
        localStorage.setItem("pharmaLabelState", stateToSave);
      } catch (error) {
        console.error("Failed to save state to local storage:", error);
      }
    }
  }, [labelState, isClient]);
  

  useEffect(() => {
    if (!isUserLoading && !user) {
      // router.replace("/login"); 
    }
  }, [isUserLoading, user, router]);
  
  useEffect(() => {
    const count = Number(labelState.labelCount);
    const currentCount = isNaN(count) || count < 1 ? 1 : count;
    
    if (activeLabelIndex > currentCount) {
      setActiveLabelIndex(currentCount);
    }
  }, [labelState.labelCount, activeLabelIndex]);

 const saveDataAndPrint = () => {
    triggerPrint();
  };
  
  const handleClearForm = () => {
    if (isClient) {
      localStorage.removeItem("pharmaLabelState");
    }
    setLabelState(defaultLabelState);
    setActiveLabelIndex(1);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-body">রোগীর তথ্য ও নির্দেশাবলী</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearForm}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">ফর্ম পরিষ্কার করুন</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ফর্ম পরিষ্কার করুন</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
             <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold">ফর্মের প্রিভিউ</CardTitle>
                  <CardDescription>
                    নিচের ফরম্যাটটি প্রিন্ট লেবেলের মতো দেখাবে ({convertToBanglaNumerals('3.6')}” x {convertToBanglaNumerals('5.6')}”)। 
                    {!labelState.showAllPreviews && labelState.labelCount > 1 && ` মোট ${convertToBanglaNumerals(labelState.labelCount)}টি লেবেলের মধ্যে ${convertToBanglaNumerals(activeLabelIndex)} নং লেবেল দেখানো হচ্ছে।`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div ref={printContainerRef}>
                      {renderPreviews()}
                  </div>
                </CardContent>
             </Card>

             <div className="flex justify-center items-center flex-wrap gap-4 mt-6">
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

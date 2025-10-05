
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Printer, Loader2 } from "lucide-react";
import { collection, query, where, getDocs, limit, doc } from "firebase/firestore";
import { useFirebase } from "@/firebase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LabelForm from "@/components/pharma-guide/label-form";
import LabelPreview from "@/components/pharma-guide/label-preview";
import { convertToBanglaNumerals } from "@/lib/utils";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";


export type LabelState = {
  serial: string;
  patientName: string;
  date: Date;
  shakeMode: "with" | "without";
  drops: number;
  shakeCount: number;
  interval: number;
  mixtureAmount: string;
  mixtureNumber: string;
  durationDays: number;
  counseling: string;
  labelCount: number;
  followUpDays: number;
  showAllPreviews: boolean;
};

export default function Home() {
  const { auth, firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();

  const [labelState, setLabelState] = useState<LabelState>({
    serial: "F/",
    patientName: "",
    date: new Date(),
    shakeMode: "with",
    drops: 5,
    shakeCount: 5,
    interval: 8,
    mixtureAmount: "এক চামচ",
    mixtureNumber: "১ম",
    durationDays: 7,
    counseling: "",
    labelCount: 1,
    followUpDays: 7,
    showAllPreviews: false,
  });
  
  const [activeLabelIndex, setActiveLabelIndex] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [isUserLoading, user, router]);
  
  const findPatientBySerial = useCallback(async (serial: string) => {
    if (!firestore || !serial || serial.trim() === 'F/') return;

    try {
      const patientsRef = collection(firestore, 'patients');
      const q = query(patientsRef, where('serialNumber', '==', serial.trim()), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const patientDoc = querySnapshot.docs[0];
        const patientData = patientDoc.data();
        if (patientData.name) {
          setLabelState(prevState => ({ ...prevState, patientName: patientData.name }));
        }
      }
    } catch (error) {
      // Non-critical read error, logging to console is acceptable here.
      console.error("Error fetching patient by serial:", error);
    }
  }, [firestore]);


  useEffect(() => {
    if (labelState.serial.trim() !== 'F/' && labelState.serial.trim() !== '') {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            findPatientBySerial(labelState.serial);
        }, 500); // 500ms debounce delay
    }

    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
  }, [labelState.serial, findPatientBySerial]);


  useEffect(() => {
    const counselingParts = [
      "• চিকিৎসাকালীন অন্য কোনো ওষুধ বা পেস্ট ব্যবহার করবেন না।",
      "• ওষুধের ৩০ মিনিট আগে ও পরে কিছু খাবেন বা পান করবেন না (পানি ছাড়া)।",
      `• জরুরী প্রয়োজনে কল করুন (সকাল ৭ টা থেকে রাত ৮ টা)।`,
      `• ${convertToBanglaNumerals(labelState.followUpDays)} দিন পরে আবার সাক্ষাৎ করবেন।`
    ];
    setLabelState(prevState => ({
      ...prevState,
      counseling: counselingParts.join('\n')
    }));
  }, [labelState.followUpDays]);
  
  useEffect(() => {
    const count = Number(labelState.labelCount);
    const currentCount = isNaN(count) || count < 1 ? 1 : count;
    
    if (activeLabelIndex > currentCount) {
      setActiveLabelIndex(currentCount);
    }
  }, [labelState.labelCount, activeLabelIndex]);

  const handlePrint = async () => {
    if (!firestore || !user) {
      console.error("Firestore not initialized or user not logged in.");
      // Optionally, show a toast to the user.
      return;
    }

    // This part handles the logic of finding an existing patient or creating a new one.
    // The actual database writes are non-blocking.
    try {
      const patientsRef = collection(firestore, 'patients');
      const q = query(patientsRef, where('serialNumber', '==', labelState.serial.trim()), limit(1));
      const querySnapshot = await getDocs(q);

      let patientId: string;

      if (!querySnapshot.empty) {
        patientId = querySnapshot.docs[0].id;
        const patientRef = doc(firestore, 'patients', patientId);
        // Non-blocking update
        setDocumentNonBlocking(patientRef, { 
            name: labelState.patientName,
            serialNumber: labelState.serial.trim(),
        }, { merge: true });
      } else {
        const newPatientRef = doc(collection(firestore, 'patients'));
        patientId = newPatientRef.id;
        const patientData = {
            id: patientId,
            name: labelState.patientName,
            serialNumber: labelState.serial.trim(),
            dateOfBirth: labelState.date.toISOString(),
        };
        // Non-blocking write
        setDocumentNonBlocking(newPatientRef, patientData);
      }
      
      const medicationLabelData = {
        patientId: patientId,
        drops: labelState.drops,
        shakeCount: labelState.shakeCount,
        intervalHours: labelState.interval,
        shakeMode: labelState.shakeMode,
        counselingInstructions: labelState.counseling,
        dateCreated: new Date().toISOString(),
      };
      const medicationLabelsColRef = collection(firestore, "patients", patientId, "medicationLabels");
      // Non-blocking add
      addDocumentNonBlocking(medicationLabelsColRef, medicationLabelData);

    } catch (error) {
       // This catch block will mostly handle errors from getDocs, as writes are non-blocking.
      console.error("Error preparing data for Firestore:", error);
       // We don't use the errorEmitter here unless we are sure it's a permission error,
       // which is handled inside the non-blocking functions.
    }

    // Proceed with printing immediately.
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


  if (!isClient || isUserLoading || !user) {
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
            <h1 className="text-3xl font-bold tracking-tight font-headline text-indigo-700">
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
              <CardTitle className="font-headline">রোগীর তথ্য ও নির্দেশাবলী</CardTitle>
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
                <Button onClick={handlePrint} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-lg shadow-xl transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50">
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

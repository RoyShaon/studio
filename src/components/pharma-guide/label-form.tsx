
import type { Dispatch, SetStateAction } from "react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import type { LabelState } from "@/app/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusCircle, XCircle, ChevronDown, Mic, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, convertToBanglaNumerals } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";


interface LabelFormProps {
  state: LabelState;
  setState: Dispatch<SetStateAction<LabelState>>;
  activeLabelIndex: number;
  setActiveLabelIndex: Dispatch<SetStateAction<number>>;
}

const predefinedCounseling: string[] = [
  "• টক জাতীয় খাবার খাবেন না।",
  "• কাঁচা পিয়াজ-রসুন খাবেন না।",
  "• এলার্জিযুক্ত সকল খাবার খাবেন।",
  "• রাত্রি জাগরণ করবেন না।",
  "• নিয়মিত প্রেসার/ডায়াবেটিসের ঔষধ খাবেন।",
  "• ঠান্ডা জাতীয় খাবার খাবেন না।",
  "• বমি, পাতলা পায়খানা, সর্দি হলে অবশ্যই জানাবেন।",
  "• অতিরিক্ত দেয়া ঔষধ ফোন না করে খাবেন না।"
];

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));

export default function LabelForm({ state, setState, activeLabelIndex, setActiveLabelIndex }: LabelFormProps) {
  const [selectedCounseling, setSelectedCounseling] = useState<string>(predefinedCounseling[0]);
  const [customCounseling, setCustomCounseling] = useState("");
  const [isCounselingOpen, setIsCounselingOpen] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const transcriptRef = useRef<string>("");
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    setSpeechRecognitionSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'bn-BD';
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      let interim_transcript = '';
      let final_transcript = transcriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
           final_transcript += event.results[i][0].transcript + ' ';
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      transcriptRef.current = final_transcript;
      
      setState(prevState => ({
        ...prevState,
        patientName: final_transcript + interim_transcript,
      }));
      
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 5000);
    };

    recognition.onerror = (event: any) => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (event.error === 'aborted') {
        return;
      }
      
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
         toast({
          variant: "destructive",
          title: "ভয়েস টাইপিং ত্রুটি",
          description: "মাইক্রোফোন ব্যবহারের অনুমতি প্রয়োজন।",
        });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      setIsListening(false);
       if (transcriptRef.current.trim()) {
            setState(prevState => ({...prevState, patientName: transcriptRef.current.trim()}));
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [setState, toast]);

  const handleListen = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      transcriptRef.current = state.patientName;
      recognition.start();
    }
    setIsListening(prevState => !prevState);
  }, [isListening, state.patientName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    if (name === 'patientName') {
        transcriptRef.current = value;
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setState(prevState => ({ ...prevState, [name]: '' }));
      return;
    }
    const numValue = parseInt(value, 10);
    setState(prevState => ({ ...prevState, [name]: isNaN(numValue) ? '' : numValue }));
  };
  
  const handleLabelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setState(prevState => ({ ...prevState, [name]: numValue as (1 | '') }));
    } else if (value === '') {
      setState(prevState => ({ ...prevState, [name]: '' as (1 | '') }));
    }
  };
  
  const getSanitizedLabelCount = () => {
    const count = Number(state.labelCount);
    return isNaN(count) || count < 1 ? 1 : count;
  }
  
  const addCounseling = () => {
      if (selectedCounseling && !state.counseling.includes(selectedCounseling)) {
          setState(prevState => ({
              ...prevState,
              counseling: [...prevState.counseling, selectedCounseling]
          }));
      }
  };
  
  const addCustomCounseling = () => {
    if (customCounseling.trim() !== "") {
        const newCounseling = `• ${customCounseling.trim()}`;
        if (!state.counseling.includes(newCounseling)) {
            setState(prevState => ({
                ...prevState,
                counseling: [...prevState.counseling, newCounseling]
            }));
            setCustomCounseling("");
        }
    }
  };

  const removeCounseling = (index: number) => {
      setState(prevState => ({
          ...prevState,
          counseling: prevState.counseling.filter((_, i) => i !== index)
      }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="serial">ক্রমিক নং</Label>
            <Input id="serial" name="serial" value={state.serial} onChange={handleInputChange} />
        </div>
        <div>
            <Label>তারিখ</Label>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !state.date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.date ? format(state.date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={state.date}
                onSelect={(date) => date && setState(prev => ({ ...prev, date }))}
                initialFocus
                />
            </PopoverContent>
            </Popover>
        </div>
      </div>

      <div>
          <Label htmlFor="patientName">রোগীর নাম</Label>
          <div className="relative flex items-center">
            <Input id="patientName" name="patientName" value={state.patientName} onChange={handleInputChange} className="pr-10" />
            {speechRecognitionSupported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-1 h-8 w-8 rounded-full",
                  isListening && "animate-pulse bg-red-100"
                )}
                onClick={handleListen}
              >
                <Mic className={cn("h-5 w-5", isListening ? "text-red-500" : "text-gray-500")} />
              </Button>
            )}
          </div>
      </div>

       <div className="mb-6">
          <RadioGroup
            value={state.shakeMode}
            onValueChange={(value: "with" | "without") => setState(prev => ({...prev, shakeMode: value}))}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center">
              <RadioGroupItem value="with" id="with-shake" className="peer sr-only" />
              <Label 
                htmlFor="with-shake"
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 border-2 border-transparent hover:border-indigo-600 font-semibold transition duration-150 cursor-pointer peer-data-[state=checked]:bg-indigo-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-indigo-600"
              >
                ঝাঁকি সহ
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="without" id="without-shake" className="peer sr-only" />
              <Label 
                htmlFor="without-shake"
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 border-2 border-transparent hover:border-indigo-600 font-semibold transition duration-150 cursor-pointer peer-data-[state=checked]:bg-indigo-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-indigo-600"
              >
                ঝাঁকি ছাড়া
              </Label>
            </div>
          </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.shakeMode === 'with' && (
                <div>
                    <Label htmlFor="shakeCount">কত বার ঝাঁকি দিবেন?</Label>
                    <Input id="shakeCount" name="shakeCount" type="number" value={state.shakeCount} onChange={handleNumberChange} min="1" />
                </div>
            )}
            <div>
                <Label htmlFor="drops">কত ফোঁটা করে খাবেন?</Label>
                <Input id="drops" name="drops" type="number" value={state.drops} onChange={handleNumberChange} min="1" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interval">কত {state.intervalUnit === 'hours' ? 'ঘন্টা' : 'দিন'} পর পর খাবেন?</Label>
            <Input id="interval" name="interval" type="number" value={state.interval} onChange={handleNumberChange} min="1" />
            <RadioGroup
              value={state.intervalUnit}
              onValueChange={(value: "hours" | "days") => setState(prev => ({...prev, intervalUnit: value}))}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hours" id="hours" />
                <Label htmlFor="hours">ঘণ্টা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="days" id="days" />
                <Label htmlFor="days">দিন</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
              <Label htmlFor="mixtureAmount">কিভাবে খাবেন?</Label>
              <Select
                  name="mixtureAmount"
                  value={state.mixtureAmount}
                  onValueChange={(value) => setState(prev => ({...prev, mixtureAmount: value}))}
                  >
                  <SelectTrigger>
                      <SelectValue placeholder="Select..."/>
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="১ চামচ ঔষধ">১ চামচ ঔষধ</SelectItem>
                      <SelectItem value="২ চামচ ঔষধ">২ চামচ ঔষধ</SelectItem>
                      <SelectItem value="৩ চামচ ঔষধ">৩ চামচ ঔষধ</SelectItem>
                      <SelectItem value="সবটুকু ঔষধ">সবটুকু ঔষধ</SelectItem>
                  </SelectContent>
                </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="durationDays">কত দিন খাবেন?</Label>
                <Input id="durationDays" name="durationDays" type="number" value={state.durationDays} onChange={handleNumberChange} min="1" />
            </div>
            <div>
                <Label htmlFor="labelCount">কতগুলো লেবেল?</Label>
                <Input 
                    id="labelCount"
                    name="labelCount"
                    type="number"
                    value={state.labelCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setState(prev => ({...prev, labelCount: value === '' ? 1 : parseInt(value, 10)}));
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                        setState(prev => ({...prev, labelCount: 1}));
                      }
                    }}
                    min="1"
                />
            </div>
             <div>
                <Label htmlFor="followUpDays">কত দিন পরে আসবেন?</Label>
                <Input id="followUpDays" name="followUpDays" type="number" value={state.followUpDays} onChange={handleNumberChange} min="1" />
            </div>
        </div>
      </div>
      
      <Collapsible
        open={isCounselingOpen}
        onOpenChange={setIsCounselingOpen}
        className="space-y-4 pt-4 border-t"
      >
        <CollapsibleTrigger className="flex w-full justify-between items-center text-lg font-semibold">
          <h3>পরামর্শ</h3>
          <ChevronDown className={cn("h-5 w-5 transition-transform", isCounselingOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-2">
                <Label>বর্তমান পরামর্শসমূহ:</Label>
                <div className="space-y-1">
                    {state.counseling.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span className="text-sm">{item}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeCounseling(index)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="counseling-select">নতুন পরামর্শ যোগ করুন (তালিকা থেকে)</Label>
                <div className="flex gap-2">
                    <Select value={selectedCounseling} onValueChange={setSelectedCounseling}>
                        <SelectTrigger id="counseling-select">
                            <SelectValue placeholder="পরামর্শ নির্বাচন করুন..." />
                        </SelectTrigger>
                        <SelectContent>
                            {predefinedCounseling.map((item, index) => (
                                <SelectItem key={index} value={item}>
                                  <div className="flex items-center">
                                      <span className="mr-2">
                                          {state.counseling.includes(item) && <Check className="h-4 w-4" />}
                                      </span>
                                      <span>{item}</span>
                                  </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={addCounseling}><PlusCircle className="h-4 w-4 mr-2" /> যোগ করুন</Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="custom-counseling">নতুন পরামর্শ যোগ করুন (কাস্টম)</Label>
                 <div className="flex gap-2">
                    <Textarea
                        id="custom-counseling"
                        placeholder="এখানে আপনার পরামর্শ লিখুন..."
                        value={customCounseling}
                        onChange={(e) => setCustomCounseling(e.target.value)}
                        className="min-h-[60px]"
                    />
                    <Button onClick={addCustomCounseling}><PlusCircle className="h-4 w-4 mr-2" /> যোগ করুন</Button>
                </div>
            </div>
        </CollapsibleContent>
       </Collapsible>


       <div className="space-y-4">
        <div className="flex items-center gap-4">
           
            {getSanitizedLabelCount() > 1 && (
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox 
                  id="showAllPreviews"
                  checked={state.showAllPreviews}
                  onCheckedChange={(checked) => setState(prev => ({ ...prev, showAllPreviews: !!checked }))}
                />
                <Label htmlFor="showAllPreviews">সকল প্রিভিউ দেখুন</Label>
              </div>
            )}
        </div>
        {getSanitizedLabelCount() > 1 && !state.showAllPreviews && (
            <div className="space-y-2">
                <Label>কোন লেবেলটি প্রিভিউ করবেন? ({convertToBanglaNumerals(activeLabelIndex)})</Label>
                <Slider
                    value={[activeLabelIndex]}
                    onValueChange={(value) => setActiveLabelIndex(value[0])}
                    min={1}
                    max={getSanitizedLabelCount()}
                    step={1}
                />
            </div>
        )}
      </div>
    </div>
  );
}

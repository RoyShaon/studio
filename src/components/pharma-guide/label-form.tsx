import type { Dispatch, SetStateAction } from "react";
import type { LabelState } from "@/app/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface LabelFormProps {
  state: LabelState;
  setState: Dispatch<SetStateAction<LabelState>>;
  activeLabelIndex: number;
  setActiveLabelIndex: Dispatch<SetStateAction<number>>;
}

export default function LabelForm({ state, setState, activeLabelIndex, setActiveLabelIndex }: LabelFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setState((prevState) => ({ ...prevState, [name]: isNaN(numValue) ? 0 : numValue }));
  };
  
  return (
    <div className="space-y-6">
       <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-700">নির্দেশিকার ধরণ নির্বাচন করুন</h3>
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
                ঝাঁকি সহ (Vial Shake)
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="without" id="without-shake" className="peer sr-only" />
              <Label 
                htmlFor="without-shake"
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 border-2 border-transparent hover:border-indigo-600 font-semibold transition duration-150 cursor-pointer peer-data-[state=checked]:bg-indigo-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-indigo-600"
              >
                ঝাঁকি ছাড়া (No Shake)
              </Label>
            </div>
          </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="labelCount">কতগুলো লেবেল প্রিন্ট করবেন?</Label>
        <Input 
            id="labelCount"
            name="labelCount"
            type="number"
            value={state.labelCount}
            onChange={handleNumberChange}
            min="1"
            className="w-24"
        />
        {state.labelCount > 1 && (
            <div className="space-y-2">
                <Label>কোন লেবেলটি প্রিভিউ করবেন? ({activeLabelIndex})</Label>
                <Slider
                    value={[activeLabelIndex]}
                    onValueChange={(value) => setActiveLabelIndex(value[0])}
                    min={1}
                    max={state.labelCount}
                    step={1}
                />
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <Label htmlFor="serial">ক্রমিক নাম্বার</Label>
            <Input id="serial" name="serial" value={state.serial} onChange={handleInputChange} />
        </div>
        <div className="md:col-span-2">
            <Label htmlFor="patientName">রোগীর নাম</Label>
            <Input id="patientName" name="patientName" value={state.patientName} onChange={handleInputChange} />
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">ঔষধের পরিমাণ সংক্রান্ত ইনপুট</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="drops">কত ফোঁটা ঔষধ?</Label>
              <Input id="drops" name="drops" type="number" value={state.drops} onChange={handleNumberChange} min="1" />
            </div>
            <div>
              <Label htmlFor="interval">কত ঘন্টা পর পর?</Label>
              <Input id="interval" name="interval" type="number" value={state.interval} onChange={handleNumberChange} min="1" />
            </div>
            {state.shakeMode === 'with' && (
              <div>
                <Label htmlFor="shakeCount">কতবার ঝাঁকাবেন?</Label>
                <Input id="shakeCount" name="shakeCount" type="number" value={state.shakeCount} onChange={handleNumberChange} min="1" />
              </div>
            )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="instructionText" className="block text-lg font-medium text-gray-700 mb-2">মূল ঔষধ খাওয়ার নিয়মাবলী (সম্পূর্ণ টেক্সট)</Label>
        <Textarea
          id="instructionText"
          name="instructionText"
          value={state.instructionText}
          onChange={handleInputChange}
          rows={5}
          className="text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">দ্রষ্টব্য: আপনি উপরের ফোঁটা, ঝাঁকি, ও ঘণ্টার মান পরিবর্তন করে এই টেক্সটটিকে প্রয়োজনমতো এডিট করতে পারবেন।</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="counseling" className="block text-lg font-medium text-gray-700 mb-2">পরামর্শ/বিশেষ নির্দেশনা</Label>
        <Textarea
          id="counseling"
          name="counseling"
          value={state.counseling}
          onChange={handleInputChange}
          rows={4}
          className="text-sm"
        />
      </div>
    </div>
  );
}

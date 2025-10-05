
import type { Dispatch, SetStateAction } from "react";
import type { LabelState } from "@/app/page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, convertToBanglaNumerals } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface LabelFormProps {
  state: LabelState;
  setState: Dispatch<SetStateAction<LabelState>>;
  activeLabelIndex: number;
  setActiveLabelIndex: Dispatch<SetStateAction<number>>;
}

export default function LabelForm({ state, setState, activeLabelIndex, setActiveLabelIndex }: LabelFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setState(prevState => ({ ...prevState, [name]: '' }));
    } else {
      const numValue = parseInt(value, 10);
      setState(prevState => ({ ...prevState, [name]: isNaN(numValue) ? 0 : numValue }));
    }
  };

  const handleLabelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setState(prevState => ({ ...prevState, [name]: numValue }));
    } else {
      setState(prevState => ({ ...prevState, [name]: '' }));
    }
  };
  
  const getSanitizedLabelCount = () => {
    const count = Number(state.labelCount);
    return isNaN(count) || count < 1 ? 1 : count;
  }

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
          <Input id="patientName" name="patientName" value={state.patientName} onChange={handleInputChange} />
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
                    <SelectItem value="১ চামচ">১ চামচ</SelectItem>
                    <SelectItem value="২ চামচ">২ চামচ</SelectItem>
                    <SelectItem value="৩ চামচ">৩ চামচ</SelectItem>
                </SelectContent>
              </Select>
        </div>

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
                onChange={handleLabelCountChange}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                    setState(prev => ({...prev, labelCount: 1}));
                  }
                }}
                min="1"
            />
        </div>
      </div>

       <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold border-b pb-2">পরামর্শ ও ফলো-আপ</h3>
        <div>
            <Label htmlFor="followUpDays">কত দিন পরে আসবেন?</Label>
            <Input id="followUpDays" name="followUpDays" type="number" value={state.followUpDays} onChange={handleNumberChange} min="1" />
        </div>
       </div>

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

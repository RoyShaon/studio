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

interface LabelFormProps {
  state: LabelState;
  setState: Dispatch<SetStateAction<LabelState>>;
}

export default function LabelForm({ state, setState }: LabelFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: parseInt(value) || 0 }));
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="serial">ক্রমিক নাম্বার</Label>
        <Input id="serial" name="serial" value={state.serial} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientName">রোগীর নাম</Label>
        <Input id="patientName" name="patientName" value={state.patientName} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
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

      <div className="space-y-3">
        <Label>ঝাঁকি মোড</Label>
        <RadioGroup
          value={state.shakeMode}
          onValueChange={(value: "with" | "without") => setState(prev => ({...prev, shakeMode: value}))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="with" id="with-shake" />
            <Label htmlFor="with-shake">ঝাঁকি সহ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="without" id="without-shake" />
            <Label htmlFor="without-shake">ঝাঁকি ছাড়া</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="drops">ফোঁটা</Label>
        <Input id="drops" name="drops" type="number" value={state.drops} onChange={handleNumberChange} min="1" />
      </div>
      
      {state.shakeMode === 'with' && (
        <div className="space-y-2">
          <Label htmlFor="shakeCount">ঝাঁকি সংখ্যা</Label>
          <Input id="shakeCount" name="shakeCount" type="number" value={state.shakeCount} onChange={handleNumberChange} min="1" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="interval">ঘণ্টার ব্যবধান</Label>
        <Input id="interval" name="interval" type="number" value={state.interval} onChange={handleNumberChange} min="1" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="counseling">পরামর্শ/বিশেষ নির্দেশনা</Label>
        <Textarea
          id="counseling"
          name="counseling"
          value={state.counseling}
          onChange={handleInputChange}
          placeholder="প্রতিটি নির্দেশনা নতুন লাইনে লিখুন..."
          rows={4}
        />
      </div>
    </div>
  );
}

import { format } from "date-fns";
import { convertToBanglaNumerals } from "@/lib/utils";
import type { LabelState } from "@/app/page";
import { Separator } from "@/components/ui/separator";

export default function LabelPreview({
  serial,
  patientName,
  date,
  shakeMode,
  drops,
  shakeCount,
  interval,
  counseling,
}: LabelState) {
  const formattedDate = convertToBanglaNumerals(format(new Date(date), "dd/MM/yyyy"));
  const banglaSerial = convertToBanglaNumerals(serial);

  const counselingPoints = counseling
    .split("\n")
    .filter((line) => line.trim() !== "");

  const renderInstruction = () => {
    const dropsText = <strong className="text-red-600">{convertToBanglaNumerals(drops)}</strong>;
    const intervalText = <strong className="text-red-600">{convertToBanglaNumerals(interval)}</strong>;
    const shakeText = <strong className="text-red-600">{convertToBanglaNumerals(shakeCount)}</strong>;
    
    if (shakeMode === 'with') {
      return (
        <p className="text-lg font-medium leading-relaxed">
          এই ঔষধটি {shakeText} টি ঝাঁকি দিয়ে {dropsText} ফোঁটা করে {intervalText} ঘণ্টা পর পর খাবেন।
        </p>
      );
    }
    return (
      <p className="text-lg font-medium leading-relaxed">
        এই ঔষধটি {dropsText} ফোঁটা করে {intervalText} ঘণ্টা পর পর খাবেন।
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-2">লেবেল প্রিভিউ (৩.৭৫ ইঞ্চি x ৫.৫ ইঞ্চি)</p>
      <div
        id="printable-label"
        className="font-headline bg-white text-black shadow-lg"
        style={{ width: "3.75in", height: "5.5in" }}
      >
        <div className="flex h-full w-full flex-col justify-start text-center p-[0.75in] box-border">
          <header className="w-full text-left space-y-1">
            <div className="flex justify-between text-base">
              <p><strong className="font-bold">ক্রমিক নং:</strong> {banglaSerial}</p>
              <p><strong className="font-bold">তারিখ:</strong> {formattedDate}</p>
            </div>
            <p className="text-base"><strong className="font-bold">রোগীর নাম:</strong> {patientName}</p>
          </header>
          
          <Separator className="bg-neutral-400 my-4" />

          <div className="border-2 border-dashed border-black p-4 my-4 w-full flex-grow flex items-center justify-center">
            {renderInstruction()}
          </div>

          <Separator className="bg-neutral-400 my-4" />

          <div className="text-left w-full mt-auto">
            <h3 className="font-bold text-lg mb-2">পরামর্শ/বিশেষ নির্দেশনা:</h3>
            <ul className="list-disc list-inside space-y-1 text-base">
              {counselingPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
              {counselingPoints.length === 0 && <li className="text-neutral-500">কোনো বিশেষ নির্দেশনা নেই।</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

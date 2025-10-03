import { format } from "date-fns";
import { convertToBanglaNumerals } from "@/lib/utils";
import type { LabelState } from "@/app/page";

export default function LabelPreview({
  serial,
  patientName,
  date,
  instructionText,
  counseling,
  drops,
  interval,
  shakeCount,
}: LabelState) {
  
  const formattedDate = convertToBanglaNumerals(format(new Date(date), "dd/MM/yyyy"));
  
  const counselingPoints = counseling
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map(line => {
      const cleanLine = line.replace(/^\s*[\d\.\-]+\s*/, '').trim(); 
      const bnLine = cleanLine.replace(/[0-9]/g, char => convertToBanglaNumerals(char));
      return `<li>• ${bnLine}</li>`; 
    }).join('');

  const renderInstruction = () => {
    let processedInstruction = instructionText;
    const styleWrapper = (value: string) => `<span class="text-red-700 font-extrabold">${value}</span>`;

    const bnDrops = convertToBanglaNumerals(drops);
    const bnInterval = convertToBanglaNumerals(interval);
    const bnShakeCount = convertToBanglaNumerals(shakeCount);
    
    // Use regex with variables
    if (instructionText.includes(`${bnShakeCount} বার ঝাঁকি দিয়ে`)) {
      processedInstruction = processedInstruction.replace(
        new RegExp(`${bnShakeCount} বার ঝাঁকি দিয়ে`, 'g'),
        `${styleWrapper(bnShakeCount)} বার ঝাঁকি দিয়ে`
      );
    }
    processedInstruction = processedInstruction.replace(
      new RegExp(`${bnDrops} ফোঁটা ঔষধ`, 'g'),
      `${styleWrapper(bnDrops)} ফোঁটা ঔষধ`
    );
    processedInstruction = processedInstruction.replace(
      new RegExp(`${bnInterval} ঘন্টা পর পর`, 'g'),
      `${styleWrapper(bnInterval)} ঘন্টা পর পর`
    );
    
    return (
      <div 
        className="instruction-box text-gray-800 text-sm p-2 min-h-0"
        dangerouslySetInnerHTML={{ __html: processedInstruction.replace(/\n/g, '<br>') }} 
      />
    );
  };
  
  return (
    <div
      id="printable-label"
      className="prescription-sheet font-headline bg-white text-black shadow-lg"
      style={{ width: "3.75in", height: "5.5in" }}
    >
        <div className="text-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-0">ত্রিকুল আরোগ্য নিকেতন</h1>
            <div className="w-full h-1"></div>
        </div>
        
        <div className="flex justify-between text-xs mb-3 font-medium">
            <span className="truncate pr-1">ক্রমিক নং: <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
            <span className="whitespace-nowrap">তারিখ: <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
        </div>
        <div className="text-left text-sm font-medium mb-3">
            নাম: <strong className="text-indigo-700 font-extrabold">{patientName}</strong>
        </div>

        <div className="text-center mb-2"> 
            <h2 className="text-base sm:text-lg font-extrabold border-y-2 border-gray-800 py-0.5 inline-block">ঔষধ খাওয়ার নিয়মাবলী</h2>
        </div>

        {renderInstruction()}

        <div className="mt-3"> 
            <h3 className="text-base font-bold text-red-700 mb-0.5">পরামর্শ:</h3> 
            <ul 
              className="advice-list text-gray-800 text-xs pl-3 list-none"
              dangerouslySetInnerHTML={{ __html: counselingPoints }}
            >
            </ul>
        </div>
    </div>
  );
}

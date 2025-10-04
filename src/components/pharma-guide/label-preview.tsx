
import { format } from "date-fns";
import { convertToBanglaNumerals } from "@/lib/utils";
import type { LabelState } from "@/app/page";

interface LabelPreviewProps extends LabelState {
  activeLabelIndex: number;
}


export default function LabelPreview({
  serial,
  patientName,
  date,
  shakeMode,
  drops,
  interval,
  shakeCount,
  mixtureAmount,
  mixtureNumber,
  durationDays,
  counseling,
  labelCount,
  activeLabelIndex
}: LabelPreviewProps) {
  
  const formattedDate = convertToBanglaNumerals(format(new Date(date), "dd/MM/yyyy"));
  const bnPatientName = patientName ? convertToBanglaNumerals(patientName) : "";

  const counselingPoints = counseling
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map(line => {
        const bnLine = convertToBanglaNumerals(line);
        return `<li>${bnLine}</li>`;
    }).join('');
    
  const renderInstruction = () => {
    const bnDrops = convertToBanglaNumerals(drops);
    const bnInterval = convertToBanglaNumerals(interval);
    const bnShakeCount = shakeMode === 'with' ? convertToBanglaNumerals(shakeCount) : '';
    const bnMixtureAmount = convertToBanglaNumerals(mixtureAmount);
    const bnMixtureNumber = convertToBanglaNumerals(mixtureNumber);
    const bnDurationDays = convertToBanglaNumerals(durationDays);
    
    const ordinalHighlight = `<span class="text-red-700 font-extrabold">${bnMixtureNumber}</span>`;

    let instruction;
    if (shakeMode === "with") {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে শিশিটিকে হাতের তালুর উপরে সজোরে ${bnShakeCount} বার ঝাঁকি দিয়ে ${bnDrops} ফোঁটা ঔষধ এক কাপ জলে ভালোভাবে মিশিয়ে ${bnInterval} ঘন্টা পর পর ${bnMixtureNumber} মিশ্রণ থেকে ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করুন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ফোঁটা ঔষধ এক কাপ জলে ভালোভাবে মিশিয়ে ${bnInterval} ঘন্টা পর পর ${bnMixtureNumber} মিশ্রণ থেকে ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করুন।`;
    }
    
    let processedInstruction = convertToBanglaNumerals(instruction);
    const styleWrapper = (value: string) => `<span class="text-red-700 font-extrabold">${value}</span>`;

    if (shakeMode === "with") {
        processedInstruction = processedInstruction.replace(
            new RegExp(bnShakeCount, 'g'),
            styleWrapper(bnShakeCount)
        );
    }
    processedInstruction = processedInstruction.replace(
      new RegExp(`${bnDrops}`, 'g'),
      styleWrapper(bnDrops)
    );
    processedInstruction = processedInstruction.replace(
      new RegExp(`${bnInterval}`, 'g'),
      styleWrapper(bnInterval)
    );
    processedInstruction = processedInstruction.replace(
        new RegExp(bnMixtureAmount, 'g'),
        styleWrapper(bnMixtureAmount)
    );
     processedInstruction = processedInstruction.replace(
      new RegExp(`${bnDurationDays}`, 'g'),
      styleWrapper(bnDurationDays)
    );

    const plainOrdinalText = new RegExp(bnMixtureNumber, 'g');
    processedInstruction = processedInstruction.replace(plainOrdinalText, ordinalHighlight);
    
    return (
      <div 
        className="instruction-box text-gray-800 text-sm p-2 min-h-0 text-center"
        dangerouslySetInnerHTML={{ __html: processedInstruction.replace(/\n/g, '<br>') }} 
      />
    );
  };
  
  const getSequentialText = () => {
    if (labelCount <= 1) return null;
    
    const bnIndex = convertToBanglaNumerals(activeLabelIndex);
    let text = "";

    if (activeLabelIndex === 1) {
      text = `${bnIndex} নং আগে খাবেন`;
    } else {
      const bnPrevIndex = convertToBanglaNumerals(activeLabelIndex - 1);
      text = `${bnIndex} নং, (${bnPrevIndex} নং এর পরে খাবেন)`;
    }
    
    return (
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-red-700">
          {text}
        </h2>
      </div>
    );
  };

  return (
    <div
      className="prescription-sheet font-headline bg-white text-black shadow-lg"
    >
        {getSequentialText()}
        <div className="text-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-0">ত্রিফুল আরোগ্য নিকেতন</h1>
        </div>
        
        <div className="flex justify-between text-xs mb-3 font-medium">
            <span className="truncate pr-1">ক্রমিক নং: <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
            <span className="whitespace-nowrap">তারিখ: <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
        </div>
        <div className="text-left text-sm font-medium mb-3">
            নাম: <strong className="text-indigo-700 font-extrabold">{bnPatientName}</strong>
        </div>

        <div className="text-center mb-2"> 
            <h2 className="text-base sm:text-lg font-extrabold border-b-2 border-gray-800 py-0.5 inline-block text-center">ঔষধ খাওয়ার নিয়মাবলী</h2>
        </div>

        {renderInstruction()}

        <div className="mt-3 text-left">
          <h3 className="text-center text-base font-bold text-red-700 mb-0.5">পরামর্শ:</h3>
          <ul
            className="advice-list text-gray-800 text-xs pl-0 list-none"
            dangerouslySetInnerHTML={{ __html: counselingPoints }}
          ></ul>
        </div>
    </div>
  );
}


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
      instruction = `প্রতিবার সেবনের পূর্বে শিশিটিকে সজোরে ${bnShakeCount} বার ঝাঁকি দিয়ে ${bnDrops} ফোঁটা ঔষধ এক কাপ জলে মিশিয়ে ${bnInterval} ঘন্টা পর পর ${bnMixtureNumber} মিশ্রণ থেকে ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করুন।`;
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
        className="instruction-box text-gray-800 text-lg p-2 min-h-[90px] text-justify"
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
        <span className="text-xl font-bold text-red-700 inline-block border border-black rounded-md py-1 px-3">
          {text}
        </span>
      </div>
    );
  };

  return (
    <div
      className="prescription-sheet font-headline bg-white text-black flex flex-col"
    >
      <div>
        {getSequentialText()}
        
        <div className="flex justify-between text-xs mb-3 font-medium">
            <span className="truncate pr-1">ক্রমিক নং: <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
            <span className="whitespace-nowrap">তারিখ: <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
        </div>
        <div className="text-left text-sm font-medium mb-3">
            রোগীর নাম: <strong className="text-indigo-700 font-extrabold">{patientName || ''}</strong>
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

      <div className="text-center pt-4">
          <h1 className="text-lg font-bold mb-1 underline">ত্রিফুল আরোগ্য নিকেতন</h1>
          <div className="text-xs font-medium">
              <p className="text-base font-bold">ডা: নীহার রঞ্জন রায়</p>
              <p>আদর্শ হোমিওপ্যাথিক চিকিৎসক</p>
              <p>বি.এস.সি, ডি.এইচ.এম.এস</p>
              <p>মোবাইল : 01716954699, 01922788466, 01871811181</p>
          </div>
      </div>
    </div>
  );
}


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
        // The '*' character is manually replaced with the HTML entity for a more distinct bullet.
        const bnLine = convertToBanglaNumerals(line).replace('•', '❖');
        return `<li>${bnLine}</li>`;
    }).join('');
    
  const renderInstruction = () => {
    const bnDrops = convertToBanglaNumerals(drops);
    const bnInterval = convertToBanglaNumerals(interval);
    const bnShakeCount = shakeMode === 'with' ? convertToBanglaNumerals(shakeCount) : '';
    const bnMixtureAmount = convertToBanglaNumerals(mixtureAmount);
    const bnDurationDays = convertToBanglaNumerals(durationDays);
    
    let instruction;
    if (shakeMode === "with") {
      instruction = `ঔষধ সেবনের আগে শিশিটিকে হাতের তালুর উপরে দূর হতে সজোরে থেমে থেমে ${bnShakeCount} বার ঝাঁকি দিয়ে ${bnDrops} ফোঁটা ঔষধ ১ কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালোভাবে মিশিয়ে নিয়ে ${bnInterval} ঘন্টা অন্তর ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করবেন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ফোঁটা ঔষধ এক কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালভাবে মিশিয়ে নিয়ে ${bnInterval} ঘন্টা অন্তর ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করবেন।`;
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
    
    return (
      <div 
        className="text-gray-800 text-lg text-left leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processedInstruction.replace(/\n/g, '<br>') }} 
      />
    );
  };
  
  const getSequentialText = () => {
    if (labelCount <= 1) return null;
    
    const bnIndex = convertToBanglaNumerals(activeLabelIndex);
    const bnLabelCount = convertToBanglaNumerals(labelCount);

    let text = `${bnIndex} নং ঔষধ (${bnLabelCount} টির মধ্যে)`;
    
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
      <div className="flex-grow space-y-4">
        <div>
            {getSequentialText()}
            
            <div className="flex justify-between text-xs mb-3 font-medium">
                <span className="truncate pr-1">ক্রমিক নং: <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
                <span className="whitespace-nowrap">তারিখঃ <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
            </div>
            <div className="text-left text-sm font-medium mb-4">
                রোগীর নামঃ <strong className="text-indigo-700 font-extrabold">{patientName || ''}</strong>
            </div>
        </div>

        <div className="space-y-2">
            <div className="text-center"> 
                <h2 className="text-base sm:text-lg font-extrabold border-b-2 border-gray-800 py-0.5 inline-block text-center">ঔষধ খাবার নিয়মাবলী</h2>
            </div>
            <div className="instruction-box text-lg text-left">
              {renderInstruction()}
            </div>
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-base font-bold text-red-700 mb-1 inline-block pb-1">পরামর্শ</h3>
          <ul
            className="advice-list text-gray-800 text-xs pl-0 list-none text-left"
            dangerouslySetInnerHTML={{ __html: counselingPoints }}
          ></ul>
        </div>
      </div>

      <div className="text-center pt-4 doctor-info">
          <div className="text-xs font-medium space-y-px">
              <p className="text-base font-bold">ডাঃ নীহার রঞ্জন রায় <span className="font-medium text-sm">(বিএসসি, ডিএইচএমএস)</span></p>
              <p>শুধুমাত্র জটিল ও পুরাতন রোগী দেখা হয়</p>
              <p>ত্রিফুল আরোগ্য নিকেতন</p>
              <p>কোটালীপাড়া সদর, গোপালগঞ্জ।</p>
              <p>০১৯২২-৭৮৮৪৬৬, ০১৭১৪-৭১৯৪২২, ০১৭১৬-৯৫৪৬৯৯</p>
          </div>
      </div>
    </div>
  );
}

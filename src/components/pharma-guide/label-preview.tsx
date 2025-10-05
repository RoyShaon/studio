
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
  intervalUnit,
  shakeCount,
  mixtureAmount,
  mixtureNumber,
  durationDays,
  counseling,
  labelCount,
  activeLabelIndex,
  followUpDays
}: LabelPreviewProps) {
  
  const formattedDate = convertToBanglaNumerals(format(date, "dd/MM/yyyy"));

  const counselingPoints = counseling
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map(line => {
        let bnLine = convertToBanglaNumerals(line);
        // Replace bullet points but handle different kinds that might be passed.
        bnLine = bnLine.replace(/^[•❖-]/, '•');
        return `<li>${bnLine}</li>`;
    }).join('');

  const finalCounseling = `${counselingPoints}<li>• ${convertToBanglaNumerals(followUpDays)} দিন পরে আসবেন।</li>`;
    
  const renderInstruction = () => {
    const bnDrops = convertToBanglaNumerals(drops);
    const bnInterval = convertToBanglaNumerals(interval);
    const bnShakeCount = shakeMode === 'with' ? convertToBanglaNumerals(shakeCount) : '';
    const bnMixtureAmount = convertToBanglaNumerals(mixtureAmount);
    const bnDurationDays = convertToBanglaNumerals(durationDays);
    const intervalUnitText = intervalUnit === 'hours' ? 'ঘন্টা' : 'দিন';
    
    let instruction;
    if (shakeMode === "with") {
        instruction = `ঔষধ সেবনের আগে শিশিটিকে হাতের তালুর উপরে দূর হতে সজোরে থেমে থেমে ${bnShakeCount} বার ঝাঁকি দিয়ে ${bnDrops} ফোঁটা ঔষধ ১ কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালোভাবে মিশিয়ে নিয়ে ${bnInterval} ${intervalUnitText} অন্তর ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করবেন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ফোঁটা ঔষধ এক কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালভাবে মিশিয়ে নিয়ে ${bnInterval} ${intervalUnitText} অন্তর ${bnMixtureAmount} করে ${bnDurationDays} দিন সেবন করবেন।`;
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
        className="text-gray-800 text-justify text-[19.1px] leading-snug"
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
                <div className="flex justify-between items-center text-sm font-medium mb-1">
                    <span className="truncate pr-1">ক্রমিক নং: <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
                    <span className="whitespace-nowrap">তারিখঃ <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
                </div>
                <div className="text-left text-base font-medium mb-4">
                    রোগীর নামঃ <strong className="text-indigo-700 font-extrabold">{patientName || ''}</strong>
                </div>
            </div>

            {getSequentialText()}

            <div className="space-y-3">
                <div className="text-center"> 
                    <h2 className="text-base sm:text-lg font-extrabold border-b-2 border-gray-800 py-0.5 inline-block text-center">ঔষধ খাবার নিয়মাবলী</h2>
                </div>
                <div className="instruction-box">
                  {renderInstruction()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-red-700 mb-1 inline-block border-b-2 border-red-700">পরামর্শ</h3>
                  <ul
                    className="advice-list text-gray-800 text-xs pl-0 list-none text-left"
                    dangerouslySetInnerHTML={{ __html: finalCounseling }}
                  ></ul>
                </div>
            </div>
        </div>
      
      <div className="text-center doctor-info space-y-1 mt-auto pt-4">
          <p className="text-base font-bold">ত্রিফুল আরোগ্য নিকেতন</p>
          <p className="text-xs">(আদর্শ হোমিওপ্যাথিক চিকিৎসালয়)</p>
          <p className="text-base font-bold">
            ডাঃ নীহার রঞ্জন রায় <span className="font-medium text-xs">(বি.এস.সি, ডি.এইচ.এম.এস)</span>
          </p>
          <p className="text-xs font-medium">(শুধুমাত্র জটিল ও পুরাতন রোগী চিকিৎসক)</p>
          <p className="text-xs">কোটালীপাড়া, গোপালগঞ্জ</p>
          <p className="text-xs">মোবাইল: ০১৭১৬৯৫৪৬৯৯, ০১৯২২৭৮৮৪৬৬, ০১৮৭১৮১১১৮১</p>
      </div>
    </div>
  );
}


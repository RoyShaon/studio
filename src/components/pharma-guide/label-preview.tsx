
import { format } from "date-fns";
import { convertToBanglaNumerals } from "@/lib/utils";
import type { LabelState } from "@/app/page";
import { Check } from "lucide-react";

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
  const bnFollowUpDays = followUpDays !== '' ? convertToBanglaNumerals(followUpDays) : '___';

  const counselingPoints = counseling
    .map(line => {
        let bnLine = convertToBanglaNumerals(line);
        // Ensure it starts with a bullet
        bnLine = bnLine.trim().startsWith('•') ? bnLine.trim() : `• ${bnLine.trim()}`;
        return `<li>${bnLine}</li>`;
    }).join('');

  const finalCounseling = `${counselingPoints}<li>• <strong class="text-red-700">${bnFollowUpDays} দিন পরে আসবেন।</strong></li>`;
    
  const renderInstruction = () => {
    const bnDrops = drops !== '' ? convertToBanglaNumerals(drops) : '___';
    const bnInterval = interval !== '' ? convertToBanglaNumerals(interval) : '___';
    const bnShakeCount = shakeMode === 'with' && shakeCount !== '' ? convertToBanglaNumerals(shakeCount) : '___';
    
    let bnMixtureAmount = convertToBanglaNumerals(mixtureAmount);
    if (mixtureAmount === "সবটুকু ঔষধ") {
        bnMixtureAmount += " ";
    }

    const bnDurationDays = durationDays !== '' ? convertToBanglaNumerals(durationDays) : '___';
    const intervalUnitText = intervalUnit === 'hours' ? 'ঘন্টা' : 'দিন';
    
    const highlightStyle = "font-extrabold text-red-700";

    let instruction;
    if (shakeMode === "with") {
        const shakeText = `ঔষধ সেবনের আগে শিশিটিকে হাতের তালুর উপরে দূর হতে সজোরে থেমে থেমে <span class="${highlightStyle}">${bnShakeCount}</span> <strong class="text-red-700">বার</strong> ঝাঁকি দিয়ে <span class="${highlightStyle}">${bnDrops}</span> <strong class="text-red-700">ফোঁটা</strong> ঔষধ <strong class="font-bold">১ কাপ</strong> ঠান্ডা জলের সাথে চামচ দিয়ে ভালোভাবে মিশিয়ে`;
        instruction = `${shakeText} <span class="${highlightStyle}">${bnMixtureAmount}</span> > <span class="${highlightStyle}">${bnInterval} ${intervalUnitText}</span> অন্তর অন্তর <span class="${highlightStyle}">${bnDurationDays}</span> <strong class="text-red-700">দিন</strong> সেবন করবেন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে <span class="${highlightStyle}">${bnDrops}</span> <strong class="text-red-700">ফোঁটা</strong> ঔষধ <strong class="font-bold">১ কাপ</strong> ঠান্ডা জলের সাথে চামচ দিয়ে ভালভাবে মিশিয়ে <span class="${highlightStyle}">${bnMixtureAmount}</span> > <span class="${highlightStyle}">${bnInterval} ${intervalUnitText}</span> পর পর <span class="${highlightStyle}">${bnDurationDays}</span> <strong class="text-red-700">দিন</strong> সেবন করুন।`;
    }
    
    let processedInstruction = convertToBanglaNumerals(instruction);
    
    return (
      <div 
        className="text-gray-800 text-justify leading-snug"
        style={{ fontSize: '13.5px' }}
        dangerouslySetInnerHTML={{ __html: processedInstruction.replace(/\n/g, '<br>') }} 
      />
    );
  };
  
  const getSequentialText = () => {
    if (labelCount <= 1) return null;

    const bnIndex = convertToBanglaNumerals(activeLabelIndex);
    
    return (
      <div className="text-center mb-2">
        <div className="text-xl font-bold text-red-700 inline-block border border-black rounded-md py-1 px-3">
          <span>{bnIndex} নং ঔষধ</span>
           {activeLabelIndex > 1 && (
             <span className="font-normal text-sm ml-1">
                ({convertToBanglaNumerals(activeLabelIndex - 1)} নং এর পরে খাবেন)
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="prescription-sheet font-body bg-white text-black flex flex-col"
    >
        <div className="flex-grow space-y-4 pt-2">
            <div>
                <div className="flex justify-between items-center text-sm font-medium mb-1">
                    <span className="truncate pr-1"><strong className="text-red-700">ক্রমিক নং:</strong> <strong className="text-indigo-700 font-extrabold">{serial}</strong></span>
                    <span className="whitespace-nowrap">তারিখঃ <strong className="text-indigo-700 font-extrabold">{formattedDate}</strong></span>
                </div>
                <div className="text-left text-base font-medium mb-4">
                    রোগীর নামঃ&nbsp;&nbsp;<strong className="text-indigo-700 font-extrabold">{patientName || ''}</strong>
                </div>
            </div>

            {getSequentialText()}

            <div className="space-y-3">
                <div className="text-center"> 
                    <h2 className="inline-block border-b-2 border-gray-800 py-1 text-center font-extrabold" style={{ fontSize: '17px' }}>ঔষধ খাবার নিয়মাবলী</h2>
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
      
      <div className="doctor-info instruction-box text-center mt-4">
          <p className="font-bold mb-0" style={{ fontSize: '0.8rem' }}>ত্রিফুল আরোগ্য নিকেতন</p>
          <p className="mb-0" style={{ fontSize: '0.5rem' }}>(আদর্শ হোমিওপ্যাথিক চিকিৎসালয়)</p>
          <p className="mb-0" style={{ fontSize: '0.7rem' }}>
            <span className="font-medium">ডাঃ নীহার রঞ্জন রায়</span> <span className="font-medium" style={{ fontSize: '0.5rem' }}>(বি.এস.সি, ডি.এইচ.এম.এস)</span>
          </p>
          <p className="mb-0" style={{ fontSize: '0.5rem' }}>(শুধুমাত্র জটিল ও পুরাতন রোগী চিকিৎসক)</p>
          <p className="mb-0" style={{ fontSize: '0.6rem' }}>কোটালীপাড়া, গোপালগঞ্জ</p>
          <p className="font-bold mb-0">
            <span style={{ fontSize: '0.6rem' }}>মোবাইল: </span>
            <span style={{ fontSize: '0.65rem' }}>01716-954699, 01922-788466, 01714-719422</span>
          </p>
      </div>
    </div>
  );
}

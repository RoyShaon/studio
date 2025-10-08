
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
  const bnFollowUpDays = followUpDays !== '' ? `<strong class="text-red-700">${convertToBanglaNumerals(followUpDays)} দিন</strong>` : '___';

  const counselingPoints = counseling
    .map(line => {
        let bnLine = convertToBanglaNumerals(line);
        // Ensure it starts with a bullet
        bnLine = bnLine.trim().startsWith('•') ? bnLine.trim() : `• ${bnLine.trim()}`;
        return `<li>${bnLine}</li>`;
    }).join('');

  const finalCounseling = `${counselingPoints}<li>• ${bnFollowUpDays} পরে আসবেন।</li>`;
    
  const renderInstruction = () => {
    const bnDrops = drops !== '' ? `<strong class="text-red-700">${convertToBanglaNumerals(drops)} ফোঁটা</strong>` : '___';
    
    let bnInterval = '';
    if (interval !== '') {
        const bnIntervalNumber = convertToBanglaNumerals(interval);
        const unitText = intervalUnit === 'hours' ? 'ঘন্টা' : 'দিন';
        bnInterval = `<strong class="text-red-700">${bnIntervalNumber} ${unitText}</strong>`;
    } else {
        bnInterval = '___';
    }

    const bnShakeCount = shakeMode === 'with' && shakeCount !== '' ? `<strong class="text-red-700">${convertToBanglaNumerals(shakeCount)} বার</strong>` : '___';
    
    let bnMixtureAmount = `<strong class="text-red-700">${convertToBanglaNumerals(mixtureAmount)}</strong>`;

    const bnDurationDays = durationDays !== '' ? `<strong class="text-red-700">${convertToBanglaNumerals(durationDays)} দিন</strong>` : '___';
    
    let instruction;
    if (shakeMode === "with") {
        instruction = `ঔষধ সেবনের আগে শিশিটিকে হাতের তালুর উপরে দূর হতে সজোরে থেমে থেমে ${bnShakeCount} ঝাঁকি দিয়ে ${bnDrops} ঔষধ ১ কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালোভাবে মিশিয়ে ${bnMixtureAmount}  > ${bnInterval} অন্তর অন্তর ${bnDurationDays} সেবন করুন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ঔষধ ১ কাপ ঠান্ডা জলের সাথে চামচ দিয়ে ভালভাবে মিশিয়ে ${bnMixtureAmount}  > ${bnInterval} অন্তর অন্তর ${bnDurationDays} সেবন করুন।`;
    }
    
    let processedInstruction = convertToBanglaNumerals(instruction);
    
    return (
      <div 
        className="text-gray-800 text-justify leading-snug"
        style={{ fontSize: '11pt' }}
        dangerouslySetInnerHTML={{ __html: processedInstruction.replace(/\n/g, '<br>') }} 
      />
    );
  };
  
  const getSequentialText = () => {
    const currentLabelCount = Number(labelCount) || 1;
    if (currentLabelCount <= 1) return null;

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
                    <span className="truncate pr-1"><strong>ক্রমিক নং:</strong> <strong className="text-red-700">{serial}</strong></span>
                    <span className="whitespace-nowrap">তারিখঃ <strong>{formattedDate}</strong></span>
                </div>
                <div className="text-left text-base font-medium mb-4">
                    রোগীর নামঃ&nbsp;&nbsp;<strong className="text-red-700">{patientName || ''}</strong>
                </div>
            </div>

            {getSequentialText()}

            <div className="space-y-3">
                <div className="text-center"> 
                    <h2 className="inline-block border-b-2 border-gray-800 py-1 text-center font-bold" style={{ fontSize: '17px' }}>ঔষধ খাবার নিয়মাবলী</h2>
                </div>
                <div className="instruction-box">
                  {renderInstruction()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-red-700 mb-1 inline-block border-b-2 border-red-700 underline">পরামর্শ</h3>
                  <ul
                    className="advice-list text-gray-800 pl-0 list-none text-left"
                    style={{ fontSize: '10.5pt' }}
                    dangerouslySetInnerHTML={{ __html: finalCounseling }}
                  ></ul>
                </div>
            </div>
        </div>
      
      <div className="doctor-info instruction-box text-center mt-auto border-none p-0">
          <p className="font-bold text-indigo-700" style={{ fontSize: '9.5pt', marginBottom: '0px', lineHeight: '1.3' }}>ত্রিফুল আরোগ্য নিকেতন</p>
          <p style={{ fontSize: '6.5pt', marginBottom: '0px', lineHeight: '1.3' }}>(আদর্শ হোমিওপ্যাথিক চিকিৎসালয়)</p>
          <p style={{ fontSize: '8.5pt', marginBottom: '0px', lineHeight: '1.3' }}>
            <strong style={{ fontWeight: '500' }}>ডাঃ নীহার রঞ্জন রায়</strong> <span style={{ fontWeight: '500', fontSize: '6pt' }}>(বি.এস.সি, ডি.এইচ.এম.এস)</span>
          </p>
          <p style={{ fontSize: '6pt', marginBottom: '0px', lineHeight: '1.3' }}>(শুধুমাত্র জটিল ও পুরাতন রোগী চিকিৎসক)</p>
          <p style={{ fontSize: '7.5pt', marginBottom: '0px', lineHeight: '1.3' }}>কোটালীপাড়া, গোপালগঞ্জ</p>
          <p className="font-bold" style={{ marginBottom: '0px', fontSize: '7.5pt', lineHeight: '1.3' }}>
            <strong>মোবাইল: </strong>
            <strong>01716-954699, 01922-788466, 01714-719422</strong>
          </p>
      </div>
    </div>
  );
}

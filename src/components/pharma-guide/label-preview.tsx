
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
  cupAmount,
  interval,
  intervalUnit,
  shakeCount,
  mixtureAmount,
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
    
    let bnMixtureAmount = `<strong class="text-red-700">${convertToBanglaNumerals(mixtureAmount).replace('১', '১&zwnj;')}</strong>`;

    const bnDurationDays = durationDays !== '' ? `<strong class="text-red-700">${convertToBanglaNumerals(durationDays)} দিন</strong>` : '___';
    
    const bnCupAmount = cupAmount === 'one_cup' ? 'এক কাপ' : 'আধা কাপ';
    const highlightedCupAmount = `<strong class="text-red-700">${bnCupAmount}</strong>`;

    let instruction;
    if (shakeMode === "with") {
        instruction = `ঔষধ সেবনের আগে শিশিটিকে হাতের তালুর উপরে দূর হতে সজোরে থেমে থেমে ${bnShakeCount} ঝাঁকি দিয়ে ${bnDrops} ঔষধ ${highlightedCupAmount} ঠান্ডা জলের সাথে চামচ দিয়ে ভালোভাবে মিশিয়ে ${bnMixtureAmount}  > ${bnInterval} অন্তর অন্তর ${bnDurationDays} সেবন করুন।`;
    } else {
      instruction = `প্রতিবার ঔষধ সেবনের পূর্বে ${bnDrops} ঔষধ ${highlightedCupAmount} ঠান্ডা জলের সাথে চামচ দিয়ে ভালভাবে মিশিয়ে ${bnMixtureAmount}  > ${bnInterval} অন্তর অন্তর ${bnDurationDays} সেবন করুন।`;
    }
    
    let processedInstruction = convertToBanglaNumerals(instruction);
    
    return (
      <div 
        className="instruction-box text-justify"
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
      className="prescription-sheet-final font-body"
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
                {renderInstruction()}
            </div>

            <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-red-700 mb-1 inline-block border-b-2 border-red-700 underline">পরামর্শ</h3>
                  <ul
                    className="advice-list text-gray-800 pl-0 list-none text-left"
                    dangerouslySetInnerHTML={{ __html: finalCounseling }}
                  ></ul>
                </div>
            </div>
        </div>
      
      <div className="doctor-info text-center">
          <div className="doctor-info-with-border">
            <p className="font-bold text-indigo-700 doctor-title">ত্রিফুল আরোগ্য নিকেতন</p>
            <p className="doctor-subtitle" style={{ fontSize: '5.5pt' }}>(আদর্শ হোমিওপ্যাথিক চিকিৎসালয়)</p>
            <p className="doctor-name">
              <strong style={{ fontWeight: '500' }}>ডাঃ নীহার রঞ্জন রায়</strong> <span className="doctor-degree" style={{ fontSize: '4.5pt', fontWeight: '500' }}>(বি.এস.সি, ডি.এইচ.এম.এস)</span>
            </p>
            <p className="doctor-specialty" style={{ fontSize: '5.5pt' }}>(শুধুমাত্র জটিল ও পুরাতন রোগী চিকিৎসক)</p>
            <p className="doctor-location">কোটালীপাড়া, গোপালগঞ্জ</p>
            <p className="font-bold doctor-contact">
              মোবাইল:&nbsp;
              01716-954699, 01922-788466, 01714-719422
            </p>
          </div>
      </div>
    </div>
  );
}

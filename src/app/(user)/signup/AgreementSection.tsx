'use client';

export interface AgreementMap {
  all: boolean;
  age: boolean;
  tos: boolean;
  privacy: boolean;
  thirdParty: boolean;
  optionalPrivacy: boolean;
  email: boolean;
}

interface AgreementSectionProps {
  agreements: AgreementMap;
  setAgreements: React.Dispatch<React.SetStateAction<AgreementMap>>;
  showError?: boolean;
}

export default function AgreementSection({ agreements, setAgreements, showError }: AgreementSectionProps) {
  const handleChange = (key: keyof typeof agreements) => {
    if (key === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        age: newValue,
        tos: newValue,
        privacy: newValue,
        thirdParty: newValue,
        optionalPrivacy: newValue,
        email: newValue,
      });
    } else {
      setAgreements(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        const allChecked = Object.entries(updated)
          .filter(([k]) => k !== 'all')
          .every(([, v]) => v);
        updated.all = allChecked;
        return updated;
      });
    }
  };

  return (
    <div className="mb-10 mt-10 text-sm text-gray-800 space-y-2">
      <label className="flex items-center gap-2 font-semibold cursor-pointer">
        <input type="checkbox" checked={agreements.all} onChange={() => handleChange('all')} className="w-4 h-4 accent-amber-100" />
        필수 및 선택 항목을 모두 포함하여 동의합니다.
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.age} onChange={() => handleChange('age')} className="w-4 h-4 accent-amber-100" />만 14세 이상입니다.
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.tos} onChange={() => handleChange('tos')} className="w-4 h-4 accent-amber-100" />
        [필수] 서비스 이용약관 동의
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.privacy} onChange={() => handleChange('privacy')} className="w-4 h-4 accent-amber-100" />
        [필수] 개인정보 수집 및 서비스 활용 동의
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.thirdParty} onChange={() => handleChange('thirdParty')} className="w-4 h-4 accent-amber-100" />
        [선택] 개인정보 제 3자 제공 동의
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.optionalPrivacy} onChange={() => handleChange('optionalPrivacy')} className="w-4 h-4 accent-amber-100" />
        [선택] 개인정보 수집 및 서비스 활용 동의
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={agreements.email} onChange={() => handleChange('email')} className="w-4 h-4 accent-amber-100" />
        [선택] 마케팅 정보 이메일 수신 동의
      </label>

      {showError && <p className="text-red-500 text-xs ml-1 mt-2">필수 약관에 동의해주세요.</p>}
    </div>
  );
}

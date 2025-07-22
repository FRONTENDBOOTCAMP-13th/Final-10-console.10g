'use client';

import { useEffect, useState } from 'react';

interface AddressData {
  address: string; // 도로명 주소
  zonecode: string; // 우편번호
  jibunAddress: string; // 지번 주소
  buildingName: string; // 건물 이름 (있을 경우)
  apartment: string; // 'Y' or 'N'
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: AddressData) => void }) => { open: () => void };
    };
  }
}

//회원 정보 수정 페이지
export default function EditInfo() {
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(false);

  // 입력값 검증
  // 비밀번호
  const [validPassword, setValidPassword] = useState(true);
  // 비밀번호 확인
  const [validPasswordCheck, setValidPasswordCheck] = useState(true);
  // 이름
  const [validName, setValidName] = useState(true);
  // 번호 두개
  const [validCall, setValidCall] = useState(true);
  const [validPhone, setValidPhone] = useState(true);

  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: AddressData) => {
        setAddresses([data.address, data.zonecode]);
      },
    }).open();
  };

  // 비밀번호 유효성 검사 8~15자리만 검사
  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/.test(password);
  };

  // TODO 서버에 POST 하기
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 폼 데이터를 이벤트에서 가져오기
    const formData = new FormData(event.currentTarget);
    // const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordCheck = formData.get('passwordCheck') as string;
    const name = formData.get('name') as string;
    const call = ((((formData.get('call1') as string) + formData.get('call2')) as string) + formData.get('call3')) as string;
    const phone = ((((formData.get('phone1') as string) + formData.get('phone2')) as string) + formData.get('phone3')) as string;

    if (!isValidPassword(password)) {
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }

    if (password !== passwordCheck) {
      setValidPasswordCheck(false);
      return;
    } else {
      setValidPasswordCheck(true);
    }

    if (!name) {
      setValidName(false);
      return;
    } else {
      setValidName(true);
    }

    if (call.length < 9) {
      setValidCall(false);
      return;
    } else {
      setValidCall(true);
    }

    if (phone.length != 11) {
      setValidPhone(false);
      return;
    } else {
      setValidPhone(true);
    }
  };

  useEffect(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  //  TODO 서버에서 GET하고, 원래 정보를 defaultValue에 적어두기
  return (
    <>
      <section className="p-4 text-xs sm:text-sm lg:text-base">
        <h2 className="font-bold text-lg lg:text-2xl py-4">회원 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[7rem_auto] lg:grid-cols-[9.375rem_auto]">
            {/* 이메일 */}
            <label htmlFor="email" className="flex items-center border-t border-gray">
              이메일
            </label>
            <div className="flex flex-col sm:flex-row flex-nowrap py-4 sm:items-center gap-4 sm:gap-8 lg:gap-12 border-t border-gray">
              <input type="email" name="email" id="email" defaultValue={`${'aewf@gmail.com'}`} className="border p-4 w-52 sm:w-60 lg:w-96" />
              <button type="button" className="rounded-lg bg-black text-white p-2 cursor-pointer w-fit">
                인증하기
              </button>
            </div>

            {/* 비밀번호 */}
            <label htmlFor="password" className="flex items-center border-t border-gray">
              비밀번호
            </label>
            <div className="flex flex-col sm:flex-row flex-nowrap py-4 sm:items-center gap-4 sm:gap-8 lg:gap-12 border-t border-gray">
              <input type="password" name="password" id="password" placeholder={`${'새로운 비밀번호를 입력하세요.'}`} className={`p-4 w-52 sm:min-w-60 lg:min-w-96 ${validPassword ? 'border' : 'border-2 border-red'}`} />
              <span className={`text-xs lg:text-sm ${validPassword ? '' : 'text-red'}`}>영문 소문자/숫자/특수문자 포함 8~15자</span>
            </div>

            {/* 비밀번호 확인 */}
            <label htmlFor="passwordCheck" className="flex items-center border-t border-gray">
              비밀번호 확인
            </label>
            <div className="flex flex-col sm:flex-row flex-nowrap py-4 sm:items-center gap-4 sm:gap-8 lg:gap-12 border-t border-gray">
              <input type="password" name="passwordCheck" id="passwordCheck" placeholder={`${'비밀번호를 다시 입력하세요.'}`} className={`border p-4 w-52 sm:min-w-60 lg:min-w-96 ${validPasswordCheck ? 'border' : 'border-2 border-red'}`} />
              <span className={`text-xs lg:text-sm ${validPasswordCheck ? 'hidden' : 'text-red'}`}>비밀번호가 다릅니다. 다시 확인해주세요.</span>
            </div>

            {/* 이름 */}
            <label htmlFor="name" className="flex items-center border-t border-gray">
              이름
            </label>
            <div className="flex flex-col flex-nowrap py-4 gap-2 border-t border-gray">
              <input type="text" name="name" id="name" defaultValue={`${'이선진'}`} className={`p-4 w-52 sm:w-60 lg:w-96 ${validName ? 'border' : 'border-2 border-red'}`} />
              <span className={`text-xs lg:text-sm ${validName ? 'hidden' : 'text-red'}`}>이름을 입력해주세요.</span>
            </div>

            {/* 주소 */}
            <label htmlFor="address1" className="flex items-center border-t border-gray">
              주소
            </label>
            <div className="flex flex-col flex-nowrap gap-2 py-4 border-t border-gray">
              <div className="flex flex-row flex-nowrap items-center gap-4">
                <input type="text" name="address1" id="address1" value={`${addresses[1] || '01010'}`} readOnly className="border p-4 w-24 sm:w-32 lg:w-60" />
                <button type="button" onClick={handleAddressSearch} className="border bg-light-yellow p-4 w-24 sm:w-24 lg:w-32 cursor-pointer">
                  주소 검색
                </button>
              </div>
              <div className="flex flex-row flex-nowrap items-center">
                <input type="text" name="address2" id="address2" value={`${addresses[0] || '서울특별시 무슨구 무슨로 123'}`} readOnly className="border p-4 w-60 sm:w-76 lg:w-96" />
              </div>
              <div className="flex flex-row flex-nowrap items-center">
                <input type="text" name="address3" id="address3" defaultValue={`${'무슨아파트 101동 101호'}`} className="border p-4 w-60 sm:w-76 lg:w-96" />
              </div>
            </div>

            {/* 일반 전화 */}
            <label htmlFor="call1" className="flex items-center border-t border-gray">
              일반 전화
            </label>
            {isMobile && (
              <div className="flex flex-col flex-nowrap border-t border-gray">
                <div className="flex flex-row flex-nowrap py-2 items-center">
                  <input type="number" id="call1" name="call1" defaultValue="02" className={`${validCall ? 'border' : 'border-2 border-red'} p-4 w-20`} />
                </div>
                <div className="flex flex-row flex-nowrap pb-2 items-center">
                  <input type="number" id="call2" name="call2" defaultValue="12345678" className={`${validCall ? 'border' : 'border-2 border-red'} p-4 w-60`} />
                </div>
                <span className={`text-xs ${validCall ? 'hidden' : 'text-red'}`}>정확한 번호를 입력해주세요.</span>
              </div>
            )}
            {!isMobile && (
              <div>
                <div className="flex flex-row flex-nowrap items-center gap-4 border-t border-gray">
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="call1" name="call1" defaultValue="02" className={`${validCall ? 'border' : 'border-2 border-red'} p-4 w-20 lg:w-24`} />
                  </div>
                  <span>-</span>
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="call2" name="call2" defaultValue="1234" className={`${validCall ? 'border' : 'border-2 border-red'} p-4 w-24 lg:w-32`} />
                  </div>

                  <span>-</span>
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="call3" name="call3" defaultValue="5678" className={`${validCall ? 'border' : 'border-2 border-red'} p-4 w-24 lg:w-32`} />
                  </div>
                </div>
                <span className={`text-xs block pb-2 ${validCall ? 'hidden' : 'text-red'}`}>정확한 번호를 입력해주세요.</span>
              </div>
            )}

            {/* 휴대 전화 */}
            <label htmlFor="phone1" className="flex items-center border-t border-gray">
              휴대 전화
            </label>
            {isMobile && (
              <div className="flex flex-col flex-nowrap border-t border-gray">
                <div className="flex flex-row flex-nowrap py-2 items-center">
                  <input type="number" id="phone1" name="phone1" defaultValue="010" className={`${validPhone ? 'border' : 'border-2 border-red'} p-4 w-20`} />
                </div>
                <div className="flex flex-row flex-nowrap pb-2 items-center">
                  <input type="number" id="phone2" name="phone2" defaultValue="12345678" className={`${validPhone ? 'border' : 'border-2 border-red'} p-4 w-60`} />
                </div>
                <span className={`text-xs ${validPhone ? 'hidden' : 'text-red'}`}>정확한 번호를 입력해주세요.</span>
              </div>
            )}
            {!isMobile && (
              <div>
                <div className="flex flex-row flex-nowrap items-center gap-4 border-t border-gray">
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="phone1" name="phone1" defaultValue="010" className={`${validPhone ? 'border' : 'border-2 border-red'} p-4 w-20 lg:w-24`} />
                  </div>
                  <span>-</span>
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="phone2" name="phone2" defaultValue="1234" className={`${validPhone ? 'border' : 'border-2 border-red'} p-4 w-24 lg:w-32`} />
                  </div>

                  <span>-</span>
                  <div className="flex flex-row flex-nowrap py-4 items-center">
                    <input type="number" id="phone3" name="phone3" defaultValue="5678" className={`${validPhone ? 'border' : 'border-2 border-red'} p-4 w-24 lg:w-32`} />
                  </div>
                </div>
                <span className={`text-xs block pb-2 ${validPhone ? 'hidden' : 'text-red'}`}>정확한 번호를 입력해주세요.</span>
              </div>
            )}

            {/* 이메일 수신 여부 */}
            <span className="flex items-center border-y border-gray">이메일 수신 여부</span>
            <div className="flex flex-row flex-nowrap items-center gap-4 border-y border-gray p-4">
              {/* TODO 기존 정보를 가져와서 checked */}
              <input type="radio" id="receive" name="receive" />
              <label htmlFor="receive">수신함</label>
              <input type="radio" id="noreceive" name="receive" />
              <label htmlFor="noreceive">수신하지 않음</label>
            </div>
          </div>

          <button type="button" className="text-sm p-2 bg-white border border-gray text-gray m-4 cursor-pointer">
            회원 탈퇴
          </button>

          <div className="flex flex-row flex-nowrap justify-center items-center gap-8 p-4">
            <button type="submit" className="p-4  bg-gray text-white cursor-pointer">
              회원 정보 수정
            </button>
            <button type="button" className="p-4 bg-white border border-gray text-gray cursor-pointer">
              취소
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

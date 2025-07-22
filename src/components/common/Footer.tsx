import Image from 'next/image';
import Link from 'next/link';
import GithubIcon from '../icon/GithubIcon';
import NotionIcon from '../icon/NotionIcon';
import KakaoIcon from '../icon/KakaoIcon';

export default function Footer() {
  return (
    <div className="bg-background px-3 py-3 sm:px-6 sm:py-6">
      <div className="max-w-[75rem] mx-auto">
        {/* logo */}
        <div className="mb-2 sm:mb-4 lg:mb-6">
          <Image src="/logo.png" alt="도토리섬 로고" width={70} height={70} className="w-18 h-18 sm:w-22 sm:h-22 lg:w-24 lg:h-24" priority />
        </div>
        <div
          className="grid grid-cols-1 gap-4
            sm:grid-cols-2 sm:grid-rows-3 sm:gap-5
            lg:grid-cols-3 lg:grid-rows-2 lg:gap-6 "
        >
          {/* C.S Center */}
          <div>
            <h2 className="font-bold">C.S Center</h2>
            <div className="text-sm sm:text-base text-dark-gray">
              <p>월요일~금요일 / 09:00 - 18:00</p>
              <p>주말시간 / 12:00 - 13:00</p>
              <p>주말 공휴일 휴무</p>
            </div>
          </div>
          {/* Company */}
          <div>
            <h2 className="font-bold">Company</h2>
            <div className="text-sm sm:text-base text-dark-gray">
              <div className="flex gap-2 sm:gap-4 lg:gap-8">
                <p>법인명: console.10g </p> <p> 대표자: 황유빈</p>
              </div>
              <p className="text-xs sm:text-sm lg:text-base">주소: 광화문 156-34 8층 멋쟁이 사자처럼</p>
              <p className="text-xs lg:text-sm">개인정보책임자: 황유빈 (dbqls1210@gmail.com)</p>
            </div>
          </div>
          {/* Return address */}
          <div>
            <h2 className="font-bold">Return address</h2>
            <p className="text-xs sm:text-sm lg:text-base text-dark-gray">주소: 광화문 156-34 8층 멋쟁이 사자처럼</p>
          </div>
          {/* SNS */}
          <div>
            <h2 className="font-bold">SNS</h2>
            <div className="flex gap-3">
              {/* GitHub */}
              <a href="https://github.com/FRONTENDBOOTCAMP-13th/Final-10-console.10g" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center hover:bg-light-gray transition">
                <GithubIcon className="w-6 h-6" />
              </a>
              {/* Notion */}
              <a href="https://www.notion.so/10-console-10g-22973873401a80f4b617c2698ca08bab" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center hover:bg-light-gray transition">
                <NotionIcon className="w-6 h-6" />
              </a>
              {/* KakaoTalk */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center hover:bg-light-gray transition">
                <KakaoIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
          {/* 1:1 FAQ */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className="font-bold">1:1 문의 FAQ</h2>
            <div className="text-sm sm:text-base text-dark-gray">
              <ul className="flex items-center">
                <li className="sm:px-1 px-0.5">
                  <Link href="/#">회사소개</Link>
                </li>
                <li className="sm:px-1 lg:px-2 px-0.5">|</li>
                <li className="sm:px-1 lg:px-2 px-0.5">
                  <Link href="/#">이용약관</Link>
                </li>
                <li className="sm:px-1 lg:px-2 px-0.5">|</li>
                <li className="sm:px-1 lg:px-2 px-0.5 font-bold">
                  <Link href="/#">개인정보처리방침</Link>
                </li>
                <li className="sm:px-1 lg:px-2 px-0.5">|</li>
                <li className="sm:px-1 lg:px-2 px-0.5">
                  <Link href="/#">이용안내</Link>
                </li>
                <li className="sm:px-1 lg:px-2 px-0.5">|</li>
                <li className="sm:px-1 lg:px-2 px-0.5">
                  <Link href="/#">배송조회</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

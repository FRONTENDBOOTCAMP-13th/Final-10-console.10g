import EditForm from './EditForm';

//회원 정보 수정 페이지
export default function EditInfo2() {
  return (
    <>
      <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
        <div className="mb-2 sm:mb-4 lg:mb-4">
          <h2 className="font-bold text-base sm:text-lg lg:text-xl">회원 정보 수정</h2>
        </div>
        <EditForm />
      </div>
    </>
  );
}

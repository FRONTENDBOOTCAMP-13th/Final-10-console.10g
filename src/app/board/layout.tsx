export default function BoardPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <div className="flex flex-col-reverse sm:flex-row max-w-[1000px] mx-auto">
        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
      {/* <Footer /> */}
    </>
  );
}

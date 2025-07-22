import Header from '@/components/common/Header';
import '../styles/globals.css';
import Footer from '@/components/common/Footer';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

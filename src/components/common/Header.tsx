'use client';

import { useEffect, useState } from 'react';
import MobileHeader from '@/components/common/MobileHeader';
import DesktopHeader from '@/components/common/DesktopHeader';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

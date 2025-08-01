'use client';

import React from 'react';

export default function DotBackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="dot-bg-wrapper">
      <div className="dot-bg-inner">{children}</div>
    </div>
  );
}

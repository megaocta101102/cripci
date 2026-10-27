'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    window.location.replace('/index.html');
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A2540', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
      <p>Memuat Mat SMA Expo City...</p>
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduTech City - Media Pembelajaran Digital',
  description: 'Media Pembelajaran Interaktif Bertema Kota Teknologi Futuristik dengan Arsitektur MVC JavaScript dan Supabase.',
  openGraph: {
    title: 'EduTech City - Media Pembelajaran Digital',
    description: 'Media Pembelajaran Interaktif Bertema Kota Teknologi Futuristik dengan Arsitektur MVC JavaScript dan Supabase.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduTech City - Media Pembelajaran Digital',
    description: 'Media Pembelajaran Interaktif Bertema Kota Teknologi Futuristik dengan Arsitektur MVC JavaScript dan Supabase.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

import '@/app/ui/global.css';
import { kufi } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Afrin Dashboard',
    default: 'Afrin Dashboard',
  },
  description: 'A dashboard application built to manage your institution seamlessly.',
  metadataBase: new URL('https://afrin-academy.vercel.app'),
  keywords: ['dashboard', 'management', 'institution'],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body dir="rtl" className={`${kufi.className} antialiased`}>{children}</body>
    </html>
  );
}

import '@/app/ui/global.css';
import { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    template: 'معهد عفرين | %s',
    default: 'معهد عفرين',
  },
  description: 'منصة جلسات الطلاب.',
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
      <body dir="rtl" className="font-kufi antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

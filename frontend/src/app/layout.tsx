import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DelaySense — Freight Disruption & Delay Risk Engine',
  description:
    'Enterprise machine learning calibrated on multi-modal logistics corridors to calculate shipment delay risk and protect delivery SLAs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-jet-950 text-smoke-100 antialiased selection:bg-cherry-600/30 selection:text-white overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}

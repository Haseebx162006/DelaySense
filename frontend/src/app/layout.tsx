import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DelaySense™ — AI Supply Chain Precision & Risk Engine',
  description: 'Enterprise AI-powered supply chain delay prediction and risk analytics platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-obsidian-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}

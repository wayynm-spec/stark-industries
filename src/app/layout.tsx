import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { appConfig } from '@/config/app';
import './globals.css';

const sans = Inter({ variable: '--font-sans', subsets: ['latin'] });
const mono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-surface-900 font-sans">
        {children}
      </body>
    </html>
  );
}

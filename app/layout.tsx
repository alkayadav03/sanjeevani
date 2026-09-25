import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'SwasthyaResilience AI — Smart Health & Supply Chain Resilience',
  description:
    'Decentralized healthcare monitoring, 7-day predictive forecasting, automated stock-out prevention, and peer-to-peer medicine redistribution for Indian Primary Health Centres.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <DisclaimerBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}

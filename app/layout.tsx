import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Real-time weather information for any city',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

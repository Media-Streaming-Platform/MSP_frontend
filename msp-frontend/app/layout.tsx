import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'StreamFlux - Your Ultimate Streaming Platform',
  description: 'Watch movies and TV shows in stunning quality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
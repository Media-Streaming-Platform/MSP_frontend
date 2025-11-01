// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import { FilterProvider } from './context/FilterContext';

export const metadata: Metadata = {
  title: 'Faith Stream',
  description: 'Media Streaming Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <FilterProvider>
          <Header />
          <main className="pt-20 pb-16">
            {children}
          </main>
        </FilterProvider>
      </body>
    </html>
  );
}
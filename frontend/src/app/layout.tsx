
import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';
import ClientWrapper from '../components/ClientWrapper';

export const metadata = {
  title: 'Keep Notes',
  description: 'A note-keeping application built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-black">
        <ClientWrapper>
          <Header />
          <main className="pt-16">{children}</main>
        </ClientWrapper>
      </body>
    </html>
  );
}
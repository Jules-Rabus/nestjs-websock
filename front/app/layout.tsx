import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jules RABUS - NestJs chat with WebSocket',
  description:
    'A simple chat application built with NestJS, Prisma, and WebSocket.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="px-4">
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

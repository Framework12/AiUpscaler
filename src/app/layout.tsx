import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/context/Providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImageUpscaler - AI-Powered Image Enhancement",
  description: "Transform your low-resolution photos into stunning high-quality images using advanced AI technology. 4x-8x upscaling with no quality loss.",
  keywords: "image upscaler, AI upscaling, photo enhancement, image enlargement, 4K upscaling",
  authors: [{ name: "ImageUpscaler" }],
  openGraph: {
    title: "ImageUpscaler - AI-Powered Image Enhancement",
    description: "Transform your photos with AI-powered upscaling. Get professional-quality results in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

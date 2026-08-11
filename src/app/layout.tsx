import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "와석초 학교업무효율화 플랫폼 모음",
  description: "와석초등학교 업무 효율화에 활용되는 웹앱 모음 플랫폼",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-[var(--font-noto-sans-kr)] antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { fontSize: "14px", maxWidth: "400px" },
          }}
        />
      </body>
    </html>
  );
}

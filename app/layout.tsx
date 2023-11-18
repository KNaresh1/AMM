import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "./components";
import "./globals.css";
import AppProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMM DApp",
  description: "NextJS Automated Market Maker DApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <NavBar />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}

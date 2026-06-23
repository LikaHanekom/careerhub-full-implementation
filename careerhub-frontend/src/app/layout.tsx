import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Providers from "./providers";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerHub",
  description: "Your next career move",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable, geistMono.variable, inter.variable
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <header className="border-b border-gray-200 bg-white px-8 py-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="container mx-auto flex max-w-5xl items-center justify-between">
                {/* Brand Link */}
                <Link href="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  CareerHub
                </Link>
                {/* Navigation Links */}
                <nav className="flex items-center gap-6">
                  <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                    Jobs
                  </Link>
                  <Link href="/dashboard/listings" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                    Dashboard
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"; // Import the provider
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <body className={cn("min-h-screen bg-background font-sans antialiased",
        geistSans.variable, 
        geistMono.variable, 
        inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* Add the Header here */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                CareerHub
              </h1>
              <ThemeToggle />
            </div>
          </header>

          <main>{children}</main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}

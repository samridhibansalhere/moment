import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeProvider from "@/providers/theme-provider";
import LayoutProvider from "@/providers/layout-provider";

export const metadata: Metadata = {
  title: "Moment",
  description: "Discover solace in the canvas of Moments, where each brushstroke paints the strokes of eternity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

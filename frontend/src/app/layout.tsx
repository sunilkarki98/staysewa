import "./globals.css";
import { ReactNode } from "react";


export const metadata = {
  title: "StaySewa | Find Your Perfect Property in Kathmandu",
  description: "The premium booking platform for hostels, apartments, and homestays in Kathmandu. Secure, verified, and reliable.",
};

// Inline script to apply theme before React hydrates (prevents flash)
const themeScript = `
  (function() {
    try {
      var match = document.cookie.match(/theme=(dark|light)/);
      var theme = match ? match[1] : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

import { AuthProvider } from "@/context/AuthContext";

import { LocationProvider } from "@/context/LocationContext";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-text">
        <QueryProvider>
          <AuthProvider>
            <LocationProvider>
              {children}
            </LocationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}


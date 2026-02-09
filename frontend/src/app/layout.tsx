import "./globals.css";
import { ReactNode } from "react";
import { UserIntentProvider } from "../context/UserIntentContext";
import Navbar from "../components/layout/Navbar"; // navbar with theme toggle
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "My Stays App",
  description: "Booking app for hostels and flats",
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-text">
        {/* Wrap everything inside UserIntentProvider */}
        <UserIntentProvider>
          {/* Navbar contains the ThemeToggle button */}
          <Navbar />
          {children}
          <Footer />
        </UserIntentProvider>
      </body>
    </html>
  );
}


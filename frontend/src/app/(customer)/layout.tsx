import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserIntentProvider } from "@/context/UserIntentContext";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserIntentProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </UserIntentProvider>
    );
}

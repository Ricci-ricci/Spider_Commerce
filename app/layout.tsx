import type { Metadata } from "next";
import "./globals.css";
import { ThemeModeProvider } from "./theme-provider";
import Navbar from "./navbar/navbar";
import { GlobalProvider } from "./context/GlobalContext";
import FooterPart1 from "./components/mainPart/footer";

export const metadata: Metadata = {
    title: "SpiderSense",
    description: "Your favorite shop",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className="antialiased"
                style={{
                    backgroundColor: "var(--color-background-body)",
                    color: "var(--color-text-primary)",
                    minHeight: "100vh",
                }}
            >
                <ThemeModeProvider>
                    <GlobalProvider>
                        <Navbar />
                        {children}
                        <FooterPart1 />
                    </GlobalProvider>
                </ThemeModeProvider>
            </body>
        </html>
    );
}

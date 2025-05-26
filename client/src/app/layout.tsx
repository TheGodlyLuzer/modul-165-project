// client/app/layout.tsx
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {PropsWithChildren} from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Recipe Manager",
    description: "Manage and share your favorite recipes",
};

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        >
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold hover:text-blue-600 transition-colors">
                    <Link href="/">Rordon Gamsey's Kochbuch</Link>
                </h1>
                <nav>
                    <Link
                        href="/recipes/create"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + Neues Rezept
                    </Link>
                </nav>
            </div>
        </header>

        <main className="container mx-auto px-4 py-6">{children}</main>
        </body>
        </html>
    );
}

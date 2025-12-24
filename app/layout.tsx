import type { Metadata } from "next";
import "./globals.css";
import { ExpenseProvider } from "@/lib/ExpenseContext";

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "A modern expense tracking application to help you manage your personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}

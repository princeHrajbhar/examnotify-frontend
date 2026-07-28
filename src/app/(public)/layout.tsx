import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: {
    default: "ExamNotify - Latest Exam Notifications and Direct Links",
    template: "%s | ExamNotify",
  },
  description:
    "Find the latest exam notifications, registration links, admit cards, results, important dates, and simple student guides.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="m-0 flex-1 p-0">{children}</main>

      <Footer />
    </div>
  );
}
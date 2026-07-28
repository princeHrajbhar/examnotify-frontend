import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  // `template` lets each page set its own title while keeping the brand suffix;
  // `default` applies to pages that set none.
  title: {
    default: "Skillo - Industry-Ready Courses in AI, Marketing & Product",
    template: "%s | Skillo",
  },
  description:
    "Live, project-based courses in AI, digital marketing, data analytics and product management. Build a portfolio, earn a certificate, get career support.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

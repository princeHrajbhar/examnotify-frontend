import type { Metadata } from "next";

import CTASection from "@/components/shared/CTASection";
import Hero from "@/components/home/Hero";
import ExamCategories from "@/components/home/ExamCategories";
import ExamUpdates from "@/components/home/ExamUpdates";
import FAQ from "@/components/home/FAQ";
import SEOContent from "@/components/home/SEOContent";


export const metadata: Metadata = {
  // `absolute` skips the "| Skillo" title template since this title already ends
  // with "by Skillo".
  title: {
    absolute: "Career Skills Courses: Data Analytics, Digital Marketing & AI by Skillo",
  },
  description:
    "Build in-demand career skills in Data Analytics, Digital Marketing, and AI/ML with job-ready training, real projects, and placement support. Start today.",
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
     <Hero/>
      <ExamCategories/>
      <ExamUpdates/>
      <CTASection />
      <FAQ/>
      <SEOContent/>
     

     
    
     
    </main>
  );
}

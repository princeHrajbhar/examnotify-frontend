import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import Course from "@/components/home/Course";
import Metrics from "@/components/home/Metrics";
import HiringPartnersSection from "@/components/home/CompanyCard";
import CTASection from "@/components/shared/CTASection";
import ComparisonSection from "@/components/home/ComparisonSection";
import Testimonial from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FAQItem";
import AccreditationSection from "@/components/home/AccreditationSection";
import MicroCoursesSEOContent from "@/components/home/SEOContent";

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
      <HeroSlider />
      <AccreditationSection />
      <Metrics />
      <Course />
      <CTASection
       
        heading="Find the Right Course for Your Career"
        description="Browse our full course catalog across Design, Data Analytics, AI+ML, and more."
        buttonText="View All Courses"
        buttonHref="/course"
      />
      <HiringPartnersSection />
      <ComparisonSection />
      <CTASection        
        heading="Your Career Transformation Starts"
        description="Join thousands of learners who've landed their dream jobs through Skillo."
        buttonText="Enroll Now"
        buttonHref="/course"
      />
      <Testimonial />
      <FAQSection />
      <MicroCoursesSEOContent />
    </main>
  );
}

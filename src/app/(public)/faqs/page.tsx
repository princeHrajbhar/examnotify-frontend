import React from "react";
import type { Metadata } from "next";
import FaqAccordion, { type Faq } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs - Skillo",
  description:
    "Find answers to common questions about Skillo's online learning platform, courses, founder, certifications, and placement support.",
};

const faqs: Faq[] = [
  {
    q: "What is Skillo?",
    a: "Skillo is an online learning platform that offers industry-focused certification courses in AI, Data Analytics, Digital Marketing, Product Management, UI/UX Design, Python, SQL, and other high-demand career skills. The platform combines live mentorship, real-world projects, career guidance, and placement support to help learners become job-ready.",
  },
  {
    q: "What does Skillo do?",
    a: "Skillo helps students and working professionals develop practical, industry-relevant skills through live online courses, mentor-led learning, portfolio development, interview preparation, and career support.",
  },
  {
    q: "Is Skillo a trusted online learning platform?",
    a: "Yes. Skillo has trained thousands of learners across India through expert-led online certification programs focused on practical learning, industry tools, and career readiness.",
  },
  {
    q: "Why should I choose Skillo over other online learning platforms?",
    a: "Unlike many platforms that rely only on recorded videos, Skillo provides live classes, experienced mentors, practical projects, portfolio reviews, mock interviews, and placement assistance.",
  },
  {
    q: "Who can join Skillo courses?",
    a: "Students, fresh graduates, working professionals, career switchers, freelancers, entrepreneurs, and anyone looking to develop in-demand digital skills can join Skillo.",
  },
  {
    q: "Who is the founder of Skillo?",
    a: "Skillo was founded by Dr. Saurabh Kumar, an academic leader, Gold Medalist in Mechanical Engineering, PhD graduate from Germany, IIM alumnus, and educator with over 24 years of experience mentoring students across India.",
  },
  {
    q: "Who is Dr. Saurabh Kumar?",
    a: "Dr. Saurabh Kumar is the Founder & CEO of Skillo and Shiksha Nation. He has mentored more than one lakh students, including IIT and NEET achievers, and is known for combining technology with quality education.",
  },
  {
    q: "What is Dr. Saurabh Kumar's educational background?",
    a: "According to Skillo, Dr. Saurabh Kumar is a Gold Medalist in Mechanical Engineering, holds a PhD from Germany, and is also an IIM alumnus.",
  },
  {
    q: "What is Dr. Saurabh Kumar known for?",
    a: "Dr. Saurabh Kumar is recognized for his work in educational innovation, AI-powered learning, student mentorship, and making industry-focused education accessible to learners across India.",
  },
  {
    q: "What is the vision of Skillo's Founder?",
    a: "The vision is to bridge the gap between education and employability by providing practical, mentor-led, technology-enabled learning experiences that prepare learners for modern careers.",
  },
  {
    q: "Where is Skillo located?",
    a: "Skillo operates from Noida, Uttar Pradesh, India, serving learners across the country through its online learning platform.",
  },
  {
    q: "Is Skillo an Indian EdTech company?",
    a: "Yes. Skillo is an India-based online education platform focused on career-oriented learning and industry-relevant certification courses.",
  },
  {
    q: "When was Skillo founded?",
    a: "According to the company timeline, the educational journey began in 2020 with the vision of making quality education accessible to everyone.",
  },
  {
    q: "How many learners has Skillo trained?",
    a: "According to Skillo, the platform has impacted more than 50,000 learners.",
  },
  {
    q: "How many educators teach at Skillo?",
    a: "Skillo works with more than 200 expert educators and industry professionals.",
  },
  {
    q: "What courses does Skillo offer?",
    a: "Skillo offers online certification courses in AI, Data Analytics, Digital Marketing, Product Management, UI/UX Design, Python, SQL, Business Intelligence, SEO, Paid Ads, Machine Learning, and related career-focused domains.",
  },
  {
    q: "Are Skillo courses beginner-friendly?",
    a: "Yes. Many Skillo certification courses are designed for beginners while also providing advanced learning opportunities for experienced professionals.",
  },
  {
    q: "Are Skillo courses suitable for working professionals?",
    a: "Yes. The platform is designed for both students and working professionals looking to upgrade their skills or switch careers.",
  },
  {
    q: "Can I learn AI from Skillo?",
    a: "Yes. Skillo offers AI-focused certification programs covering practical AI tools, automation, machine learning fundamentals, and industry applications.",
  },
  {
    q: "Does Skillo teach Digital Marketing?",
    a: "Yes. The Digital Marketing course includes SEO, Google Ads, Paid Advertising, Social Media Marketing, Analytics, and performance marketing concepts.",
  },
  {
    q: "Are Skillo classes live?",
    a: "Yes. Skillo provides live online classes conducted by experienced mentors.",
  },
  {
    q: "Will I work on real-world projects?",
    a: "Yes. Learners complete practical projects designed around real business scenarios to build job-ready skills.",
  },
  {
    q: "Does Skillo provide mentorship?",
    a: "Yes. Students receive guidance from experienced mentors throughout their learning journey.",
  },
  {
    q: "Does Skillo provide portfolio support?",
    a: "Yes. Portfolio building and mentor feedback are included to help learners showcase their practical skills.",
  },
  {
    q: "Does Skillo offer mock interviews?",
    a: "Yes. Mock interviews are part of the career preparation process to improve confidence and interview performance.",
  },
  {
    q: "Does Skillo provide placement assistance?",
    a: "Yes. Skillo offers placement support, interview preparation, resume guidance, portfolio reviews, and career mentoring.",
  },
  {
    q: "Can Skillo help me switch careers?",
    a: "Yes. The platform is designed for professionals transitioning into fields like AI, Data Analytics, Product Management, and Digital Marketing.",
  },
  {
    q: "Will I receive career guidance?",
    a: "Yes. Learners receive career counseling and guidance throughout their upskilling journey.",
  },
  {
    q: "How does Skillo prepare learners for jobs?",
    a: "Skillo combines live learning, practical projects, portfolio development, mentor reviews, interview preparation, and placement guidance.",
  },
  {
    q: "Can beginners get jobs after completing Skillo courses?",
    a: "Many courses are designed to help beginners build practical skills that improve employability, supported by career guidance and placement assistance.",
  },
  {
    q: "Does Skillo provide certificates?",
    a: "Yes. Learners receive an industry-recognized certification after successfully completing their course requirements.",
  },
  {
    q: "Are Skillo certificates useful for resumes?",
    a: "Yes. Certifications can strengthen resumes and LinkedIn profiles when combined with practical projects and demonstrated skills.",
  },
  {
    q: "Can I add my Skillo certification to LinkedIn?",
    a: "Yes. Learners can showcase their certification and project portfolio on LinkedIn.",
  },
  {
    q: "Does Skillo use Artificial Intelligence?",
    a: "Yes. Skillo integrates AI-powered learning tools to personalize education and enhance the learning experience.",
  },
  {
    q: "What are AI-powered learning tools?",
    a: "AI-powered learning tools personalize recommendations, assessments, and learning paths to improve learner engagement and outcomes.",
  },
  {
    q: "Does Skillo provide personalized learning?",
    a: "Yes. The platform uses technology and expert guidance to deliver personalized learning experiences.",
  },
  {
    q: "Who leads academics at Skillo?",
    a: "Academic leadership includes experienced educators such as Anurag Mishra (VP Academics - JEE) and Dr. NK Sharma (VP Academics - NEET).",
  },
  {
    q: "Why do learners trust Skillo?",
    a: "Learners value Skillo for its experienced mentors, practical curriculum, career support, AI-powered learning tools, and focus on employability.",
  },
  {
    q: "What makes Skillo different?",
    a: "Skillo emphasizes hands-on learning, live mentorship, real-world projects, career guidance, and placement support rather than only recorded content.",
  },
  {
    q: "Does Skillo support lifelong learning?",
    a: "Yes. Skillo encourages continuous upskilling to help learners adapt to changing industry demands and emerging technologies.",
  },
  {
    q: "Can college students join Skillo?",
    a: "Yes. College students can join certification programs to build industry-ready skills before graduation.",
  },
  {
    q: "Can fresh graduates learn job-ready skills at Skillo?",
    a: "Yes. Skillo courses focus on practical knowledge, helping fresh graduates become more competitive in the job market.",
  },
  {
    q: "Is Skillo part of Shiksha Nation?",
    a: "Yes. Skillo is part of the Shiksha Nation ecosystem and focuses on career-oriented professional education and certification programs.",
  },
  {
    q: "How can I contact Skillo?",
    a: "Learners can contact Skillo through the official website, support email, helpline, or by visiting the headquarters in Noida, Uttar Pradesh.",
  },
  {
    q: "Does Skillo offer free career consultation?",
    a: "Yes. According to the platform, learners can request a free consultation to receive personalized course recommendations.",
  },
  {
    q: "How do I enroll in a Skillo course?",
    a: "Learners can explore available courses on the official Skillo website, choose the program that matches their career goals, and complete the enrollment process online.",
  },
  {
    q: "Why is Skillo becoming popular among learners?",
    a: "Skillo is gaining recognition because it combines expert-led live classes, AI-powered learning, practical projects, career mentorship, placement support, and industry-recognized certifications in one learning ecosystem.",
  },
];

const Page = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* ==================== HERO BANNER ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white">
        {/* Decorative bubbles */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-sky-200/60 blur-[2px]" />
          <div className="absolute left-24 top-24 h-20 w-20 rounded-full border border-sky-300/50" />
          <div className="absolute left-16 bottom-6 h-10 w-10 rounded-full bg-sky-300/40" />
          <div className="absolute left-1/2 top-4 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sky-400/70" />
          <div className="absolute left-[38%] top-16 h-14 w-14 rounded-full border border-dashed border-sky-300/60" />
          <div className="absolute right-1/4 top-2 h-2 w-2 rounded-full bg-sky-400/70" />
          <div className="absolute right-40 top-14 h-24 w-24 rounded-full border border-sky-300/50" />
          <div className="absolute right-10 top-28 h-2.5 w-2.5 rounded-full bg-sky-400/70" />
          <div className="absolute -right-6 top-0 h-40 w-40 rounded-full bg-sky-200/50 blur-[2px]" />
          <div className="absolute right-16 bottom-4 h-16 w-16 rounded-full bg-sky-300/50" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* ==================== FAQ ACCORDION ==================== */}
      <section className="bg-white py-12 sm:py-16">
        <FaqAccordion faqs={faqs} />
      </section>
    </main>
  );
};

export default Page;
import { Brain, Code2, Database, GraduationCap, Network, ShieldCheck, Speech } from "lucide-react";

export type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  students: string;
  price: string;
  oldPrice?: string;
  rating: number;
  categories: string[];
  isTrending?: boolean;
  isPopular?: boolean;
  isFree?: boolean;
};

export function toCourseSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type BrowseCategory = {
  key: string;
  slug: string;
  label: string;
  description: string;
  Icon: typeof Code2;
  iconBg: string;
  iconFg: string;
};

export const browseCategories: BrowseCategory[] = [
  {
    key: "Web Development",
    slug: "web-development",
    label: "Web Development",
    description: "Build modern apps with in-demand skills.",
    Icon: Code2,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "Frontend",
    slug: "frontend",
    label: "Frontend",
    description: "React-focused learning for UI mastery.",
    Icon: GraduationCap,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "Full Stack",
    slug: "full-stack",
    label: "Full Stack",
    description: "From UI to APIs and production workflows.",
    Icon: Network,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "Data Science",
    slug: "data-science",
    label: "Data Science",
    description: "Analytics + ML foundations with projects.",
    Icon: Database,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "AI & Cloud",
    slug: "ai-cloud",
    label: "AI & Cloud",
    description: "AI delivery and cloud-ready skill paths.",
    Icon: Brain,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "SAP",
    slug: "sap",
    label: "SAP",
    description: "Structured SAP FI/CO training guidance.",
    Icon: GraduationCap,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "Soft Skills",
    slug: "soft-skills",
    label: "Soft Skills",
    description: "Communication and interview readiness.",
    Icon: Speech,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
  {
    key: "Cyber Security",
    slug: "cyber-security",
    label: "Cyber Security",
    description: "Security fundamentals and defensive practice.",
    Icon: ShieldCheck,
    iconBg: "bg-[#3B6CB7]/10",
    iconFg: "text-[#3B6CB7]",
  },
];

export const COURSES: Course[] = [
  {
    id: 0,
    title: "Advanced JavaScript (ES6+)",
    description:
      "Master modern JavaScript concepts including ES6+, closures, promises, async/await, and real-world projects.",
    duration: "6 Months",
    students: "3,200",
    price: "₹45,000",
    oldPrice: "₹75,000",
    rating: 4.8,
    categories: ["Web Development"],
    isTrending: true,
    isPopular: true,
  },
  {
    id: 1,
    title: "React.js Masterclass",
    description:
      "Build scalable frontend apps using React, hooks, routing, state management, and performance best practices.",
    duration: "3 Months",
    students: "1,800",
    price: "₹25,000",
    oldPrice: "₹40,000",
    rating: 5.0,
    categories: ["Web Development", "Frontend"],
    isPopular: true,
  },
  {
    id: 2,
    title: "Next.js Advanced",
    description:
      "Learn server-side rendering, API routes, and full-stack development with Next.js and production-grade patterns.",
    duration: "4 Months",
    students: "2,400",
    price: "₹30,000",
    oldPrice: "₹50,000",
    rating: 5.0,
    categories: ["Web Development", "Full Stack"],
    isTrending: true,
    isPopular: true,
  },
  {
    id: 3,
    title: "Python for Data Science",
    description:
      "Understand data analysis fundamentals with Python, explore real datasets, and build analytics-ready pipelines.",
    duration: "5 Months",
    students: "2,900",
    price: "₹35,000",
    rating: 4.7,
    categories: ["Data Science"],
    isTrending: true,
  },
  {
    id: 4,
    title: "Machine Learning Foundations",
    description:
      "Learn core ML concepts with hands-on labs covering supervised/unsupervised learning and model evaluation.",
    duration: "4 Months",
    students: "2,100",
    price: "₹40,000",
    oldPrice: "₹60,000",
    rating: 4.9,
    categories: ["AI & Cloud", "Data Science"],
    isTrending: true,
    isPopular: true,
  },
  {
    id: 5,
    title: "SAP FICO Essentials",
    description:
      "Get a structured foundation in SAP FI/CO with core concepts, workflows, and practical scenario-based learning.",
    duration: "3 Months",
    students: "1,500",
    price: "₹28,000",
    oldPrice: "₹45,000",
    rating: 4.6,
    categories: ["SAP"],
    isPopular: true,
  },
  {
    id: 6,
    title: "Soft Skills & Communication",
    description:
      "Improve communication, interview readiness, and professional confidence with practical exercises and coaching.",
    duration: "1 Month",
    students: "3,600",
    price: "₹12,000",
    rating: 4.8,
    categories: ["Soft Skills"],
    isFree: true,
  },
  {
    id: 7,
    title: "Cybersecurity Bootcamp",
    description:
      "Learn security basics, threat models, and defensive practices through guided labs and real-world case studies.",
    duration: "4 Months",
    students: "1,900",
    price: "₹42,000",
    oldPrice: "₹65,000",
    rating: 4.7,
    categories: ["Cyber Security"],
    isTrending: true,
    isPopular: false,
  },
];


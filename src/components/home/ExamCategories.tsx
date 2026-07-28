import Link from "next/link";

type CategoryItem = {
  label: string;
  href: string;
  icon: string;
};

const notificationCategories: CategoryItem[] = [
  {
    label: "Latest Jobs",
    href: "/notifications/latest-jobs",
    icon: "💼",
  },
  {
    label: "Admit Cards",
    href: "/notifications/admit-cards",
    icon: "🎫",
  },
  {
    label: "Exam Results",
    href: "/notifications/results",
    icon: "📊",
  },
  {
    label: "Answer Keys",
    href: "/notifications/answer-keys",
    icon: "🔑",
  },
  {
    label: "Exam Dates",
    href: "/notifications/exam-dates",
    icon: "📅",
  },
  {
    label: "Application Forms",
    href: "/notifications/applications",
    icon: "📝",
  },
  {
    label: "Syllabus",
    href: "/notifications/syllabus",
    icon: "📚",
  },
  {
    label: "Cut Off Marks",
    href: "/notifications/cut-off",
    icon: "📈",
  },
  {
    label: "Counselling",
    href: "/notifications/counselling",
    icon: "🎓",
  },
  {
    label: "Important Updates",
    href: "/notifications/updates",
    icon: "📢",
  },
];

const stateCategories: CategoryItem[] = [
  {
    label: "Uttar Pradesh",
    href: "/notifications/state/uttar-pradesh",
    icon: "UP",
  },
  {
    label: "Bihar",
    href: "/notifications/state/bihar",
    icon: "BR",
  },
  {
    label: "Rajasthan",
    href: "/notifications/state/rajasthan",
    icon: "RJ",
  },
  {
    label: "Madhya Pradesh",
    href: "/notifications/state/madhya-pradesh",
    icon: "MP",
  },
  {
    label: "Maharashtra",
    href: "/notifications/state/maharashtra",
    icon: "MH",
  },
  {
    label: "Delhi",
    href: "/notifications/state/delhi",
    icon: "DL",
  },
  {
    label: "Haryana",
    href: "/notifications/state/haryana",
    icon: "HR",
  },
  {
    label: "Punjab",
    href: "/notifications/state/punjab",
    icon: "PB",
  },
  {
    label: "Gujarat",
    href: "/notifications/state/gujarat",
    icon: "GJ",
  },
  {
    label: "West Bengal",
    href: "/notifications/state/west-bengal",
    icon: "WB",
  },
  {
    label: "Odisha",
    href: "/notifications/state/odisha",
    icon: "OD",
  },
  {
    label: "Jharkhand",
    href: "/notifications/state/jharkhand",
    icon: "JH",
  },
  {
    label: "Chhattisgarh",
    href: "/notifications/state/chhattisgarh",
    icon: "CG",
  },
  {
    label: "Karnataka",
    href: "/notifications/state/karnataka",
    icon: "KA",
  },
  {
    label: "Tamil Nadu",
    href: "/notifications/state/tamil-nadu",
    icon: "TN",
  },
  {
    label: "Telangana",
    href: "/notifications/state/telangana",
    icon: "TS",
  },
  {
    label: "Andhra Pradesh",
    href: "/notifications/state/andhra-pradesh",
    icon: "AP",
  },
  {
    label: "Kerala",
    href: "/notifications/state/kerala",
    icon: "KL",
  },
  {
    label: "Assam",
    href: "/notifications/state/assam",
    icon: "AS",
  },
  {
    label: "Uttarakhand",
    href: "/notifications/state/uttarakhand",
    icon: "UK",
  },
];

export default function ExamCategories() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryRow
          title="Exam Notifications"
          description="Access important exam updates and direct links."
          items={notificationCategories}
          variant="red"
        />

        <div className="mt-8">
          <CategoryRow
            title="State-Wise Notifications"
            description="Explore exam notifications and government jobs by state."
            items={stateCategories}
            variant="green"
          />
        </div>
      </div>
    </section>
  );
}

type CategoryRowProps = {
  title: string;
  description: string;
  items: CategoryItem[];
  variant: "red" | "green";
};

function CategoryRow({
  title,
  description,
  items,
  variant,
}: CategoryRowProps) {
  const headingColor =
    variant === "red" ? "text-red-600" : "text-green-600";

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold sm:text-2xl ${headingColor}`}>
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <span className="hidden shrink-0 text-xs font-medium text-slate-400 sm:block">
          Scroll to explore →
        </span>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <CategoryCard
            key={item.label}
            item={item}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

type CategoryCardProps = {
  item: CategoryItem;
  variant: "red" | "green";
};

function CategoryCard({ item, variant }: CategoryCardProps) {
  const cardClasses =
    variant === "red"
      ? "border-red-100 hover:border-red-300 hover:bg-red-50"
      : "border-green-100 hover:border-green-300 hover:bg-green-50";

  const iconClasses =
    variant === "red"
      ? "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
      : "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white";

  const arrowClasses =
    variant === "red" ? "text-red-500" : "text-green-600";

  return (
    <Link
      href={item.href}
      className={`group flex min-w-[190px] snap-start items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-w-[215px] ${cardClasses}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${iconClasses}`}
      >
        {item.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">
          {item.label}
        </span>

        <span className="mt-0.5 block text-xs text-slate-500">
          View notifications
        </span>
      </span>

      <svg
        className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 ${arrowClasses}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
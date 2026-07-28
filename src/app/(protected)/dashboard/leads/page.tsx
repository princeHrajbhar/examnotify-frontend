import { LeadsList } from "@/components/dashboard/leads/LeadsList";

export const metadata = {
  title: "Leads Management",
  description: "Manage all your leads in one place",
};

export default function LeadsPage() {
  return <LeadsList />;
}
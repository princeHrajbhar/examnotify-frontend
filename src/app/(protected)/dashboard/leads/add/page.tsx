"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LeadForm from "@/components/dashboard/leads/LeadForm";

export default function AddLeadPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/leads");
  };

  const handleCancel = () => {
    router.push("/dashboard/leads");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/leads" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
            <p className="text-sm text-gray-500">Create a new lead in your system</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <LeadForm onSuccess={handleSuccess} onCancel={handleCancel} submitLabel="Add Lead" />
        </div>
      </div>
    </div>
  );
}
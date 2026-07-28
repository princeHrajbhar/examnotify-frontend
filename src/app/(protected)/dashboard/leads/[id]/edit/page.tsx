"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LeadForm from "@/components/dashboard/leads/LeadForm";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
            <p className="text-sm text-gray-500">Update lead information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <LeadForm leadId={id} onSuccess={handleSuccess} onCancel={handleCancel} submitLabel="Update Lead" />
        </div>
      </div>
    </div>
  );
}
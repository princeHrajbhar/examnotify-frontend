"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useLead } from "@/features/lead/hooks/useLead";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  enrolled: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

export default function ViewLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { useGetLeadById, deleteLead } = useLead();
  const { data, isLoading, error } = useGetLeadById(id);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        router.push("/dashboard/leads");
      } catch (error) {
        alert("Failed to delete lead");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead Not Found</h2>
            <p className="text-gray-500 mb-4">The lead you're looking for doesn't exist.</p>
            <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lead = data.data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/leads" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
              <p className="text-sm text-gray-500">View lead information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/leads/${id}/edit`}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{lead.name || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[lead.status]}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-900">{lead.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-gray-900">{lead.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Course</h3>
                <p className="mt-1 text-gray-900">{lead.course}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Source</h3>
                <p className="mt-1 text-gray-900">
                  {lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace(/-/g, " ")}
                </p>
              </div>
              {lead.pagePath && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Page Path</h3>
                  <p className="mt-1 text-gray-900">{lead.pagePath}</p>
                </div>
              )}
              {lead.pageTitle && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Page Title</h3>
                  <p className="mt-1 text-gray-900">{lead.pageTitle}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1 text-gray-900">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-gray-900">{new Date(lead.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {lead.createdBy && (
                <div>
                  <span className="font-medium">Created By:</span> {lead.createdBy.name} ({lead.createdBy.email})
                </div>
              )}
              {lead.updatedBy && (
                <div>
                  <span className="font-medium">Last Updated By:</span> {lead.updatedBy.name} ({lead.updatedBy.email})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
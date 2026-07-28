"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, MoreVertical, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLead } from "@/features/lead/hooks/useLead";
import type { ILead, LeadStatus } from "@/features/lead/api/leadApi";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  enrolled: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const statusOptions: LeadStatus[] = ["new", "contacted", "enrolled", "lost"];

export function LeadsList() {
  const {
    useGetLeads,
    deleteLead,
    updateLeadStatus,
    updateFilters,
    changePage,
    changeLimit,
    filters,
  } = useLead();

  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error, refetch } = useGetLeads({
    page: filters.page || 1,
    limit: filters.limit || 10,
    search: searchTerm || undefined,
    status: filters.status as LeadStatus | undefined,
    sortBy: filters.sortBy as 'createdAt' | 'updatedAt' | 'status' | undefined,
    sortDir: filters.sortDir as 'asc' | 'desc' | undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        updateFilters({ search: searchTerm, page: 1 });
      } else {
        updateFilters({ search: undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, updateFilters]);

  const leads = data?.data?.leads || [];
  const pagination = data?.data?.pagination;

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus({ id, status: newStatus });
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
      } catch (error) {
        console.error("Failed to delete lead:", error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    changeLimit(newLimit);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leads...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = "Failed to fetch leads. Please try again.";
    let errorDetails = "";
    
    if (typeof error === 'object' && error !== null) {
      if ('data' in error && typeof error.data === 'object' && error.data && 'message' in error.data) {
        errorMessage = (error.data as any).message;
        errorDetails = (error.data as any).message;
      }
      if ('status' in error) {
        errorDetails += ` (Status: ${error.status})`;
      }
    }

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-red-800 font-semibold text-lg">Error Loading Leads</h3>
            <p className="text-red-600 mt-2">{errorMessage}</p>
            {errorDetails && (
              <p className="text-red-500 text-sm mt-1 bg-red-100 p-2 rounded">{errorDetails}</p>
            )}
            <div className="mt-4 space-x-2">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-500">
              Total: {pagination?.total || 0} leads
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/dashboard/leads/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <select
            value={filters.status || ""}
            onChange={(e) => {
              const value = e.target.value as LeadStatus | "";
              updateFilters({ status: value || undefined, page: 1 });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.limit || 10}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? `No results found for "${searchTerm}"` : "Start by creating your first lead"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateFilters({ search: undefined });
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead: ILead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{lead.name || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace(/-/g, ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(lead.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${statusColors[lead.status]}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/leads/${lead._id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/dashboard/leads/${lead._id}/edit`} className="text-gray-400 hover:text-yellow-600 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(lead._id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors" title="More">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex flex-wrap items-center justify-between border-t border-gray-200 gap-4">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
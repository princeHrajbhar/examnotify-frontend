"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useLead } from "@/features/lead/hooks/useLead";
import type { CreateLeadRequest, UpdateLeadRequest, LeadStatus } from "@/features/lead/api/leadApi";

interface LeadFormProps {
  leadId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const courses = [
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "Machine Learning",
  "Cybersecurity",
  "Django Developer Course",
  "React Developer Course",
  "Full Stack Development",
];

const sources = [
  "website",
  "hero-form",
  "popup",
  "contact-page",
  "referral",
  "linkedin",
  "instagram",
  "twitter",
  "facebook",
  "email",
  "phone-call",
  "event",
  "other",
];

const statusOptions: LeadStatus[] = ["new", "contacted", "enrolled", "lost"];

interface FormData {
  name: string;
  phone: string;
  email: string;
  course: string;
  source: string;
  status: LeadStatus;
  pagePath: string;
  pageTitle: string;
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  email: "",
  course: "",
  source: "website",
  status: "new",
  pagePath: "",
  pageTitle: "",
};

export default function LeadForm({ leadId, onSuccess, onCancel, submitLabel = "Add Lead" }: LeadFormProps) {
  const { useGetLeadById, createLead, updateLead } = useLead();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLeadQuery = useGetLeadById(leadId || "");
  const { data: leadData, isLoading } = getLeadQuery;

  useEffect(() => {
    if (leadData?.data) {
      const lead = leadData.data;
      setFormData({
        name: lead.name || "",
        phone: lead.phone,
        email: lead.email,
        course: lead.course,
        source: lead.source,
        status: lead.status,
        pagePath: lead.pagePath || "",
        pageTitle: lead.pageTitle || "",
      });
    }
  }, [leadData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 7 || formData.phone.length > 15) {
      newErrors.phone = "Phone number must be between 7 and 15 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.course) {
      newErrors.course = "Course is required";
    }

    if (!formData.source) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (leadId) {
        const updateData: UpdateLeadRequest = {
          name: formData.name || undefined,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          status: formData.status,
        };
        await updateLead({ id: leadId, body: updateData });
      } else {
        const createData: CreateLeadRequest = {
          name: formData.name || undefined,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          source: formData.source,
          pagePath: formData.pagePath || undefined,
          pageTitle: formData.pageTitle || undefined,
        };
        await createLead(createData);
      }

      onSuccess?.();
    } catch (error: any) {
      alert(error.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.course ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source *</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.source ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a source</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source.charAt(0).toUpperCase() + source.slice(1).replace(/-/g, " ")}
              </option>
            ))}
          </select>
          {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source}</p>}
        </div>

        {leadId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Path</label>
          <input
            type="text"
            name="pagePath"
            value={formData.pagePath}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="/courses/web-development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
          <input
            type="text"
            name="pageTitle"
            value={formData.pageTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Web Development Course"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen,
  WifiOff,
} from 'lucide-react';
import { useCourse } from '@/features/course/hooks/useCourse';
import CourseForm from '@/components/dashboard/CourseForm';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { useGetCourseById, updateCourse } = useCourse();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: courseData, isLoading, refetch, error: fetchError } = useGetCourseById(id);

  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  useEffect(() => {
    if (fetchError) setError('Failed to load course data. Please try again.');
  }, [fetchError]);

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (!navigator.onLine) {
      setError('You are offline. Please check your internet connection.');
      setSaving(false);
      return;
    }

    try {
      await updateCourse({ id, body: formData });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/courses'), 2000);
    } catch (err: any) {
      if (err?.error === 'FETCH_ERROR' || err?.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => router.push('/login'), 2000);
      } else if (err?.status === 403) {
        setError('You do not have permission to update this course.');
      } else if (err?.status === 404) {
        setError('Course not found.');
      } else {
        setError(err?.data?.message || err?.message || 'Failed to update course.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const course = courseData?.data;

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-600">Course not found</p>
        <Link href="/dashboard/courses" className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700">You are offline. Please check your internet connection.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/courses" className="p-2 bg-white rounded-xl shadow-sm text-gray-600 hover:text-teal-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Edit Course
            </h1>
            <p className="text-sm text-gray-500 mt-1">{course.title}</p>
          </div>
        </div>
        <Link href="/dashboard/courses" className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700">
          Cancel
        </Link>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-700">Success</p>
            <p className="text-sm text-emerald-600">Course updated successfully! Redirecting...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      <CourseForm initialData={course} onSubmit={handleSubmit} loading={saving} isEdit />
    </div>
  );
}

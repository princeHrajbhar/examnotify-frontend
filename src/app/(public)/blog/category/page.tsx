// app/blog/categories/page.tsx
'use client';

import { useBlogCategory } from '@/features/blogCategory/hooks/useBlogCategory';
import Link from 'next/link';

export default function CategoriesPage() {
  const { useGetBlogCategories } = useBlogCategory();
  const { data, isLoading, isError, error } = useGetBlogCategories();

  const categories = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Blog Categories
        </h1>
        <p className="text-lg text-gray-600">
          Explore articles by category
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">⚠️ Failed to load categories</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-48 rounded-xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category._id}
              href={`/blog/category/${category.slug}`}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-purple-600 p-6 h-48 flex flex-col justify-between">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-1 group-hover:underline">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    View articles →
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-600">No categories found</h3>
          <p className="text-gray-500 mt-2">Categories will appear here once created.</p>
        </div>
      )}

      {/* Stats */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          Total Categories: {categories.length}
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Upload,
  Image as ImageIcon,
  Link2,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Loader2,
  User
} from 'lucide-react';
import { useBlog } from '../../../../../features/blog/hooks/useBlog';
import { useBlogCategory } from '../../../../../features/blogCategory/hooks/useBlogCategory';
import useAuth from '../../../../../features/auth/hooks/useAuth';
import { useUser } from '../../../../../features/user/hooks/useUser';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ContentPreview from '@/components/editor/ContentPreview';

interface FAQ {
  question: string;
  answer: string;
}

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface ResourceLink {
  title: string;
  url: string;
}

interface UploadedFile {
  url: string;
  storageKey: string;
  mimeType: string;
  originalName: string;
  size: number;
  extension: string;
  uploadedAt: string;
  etag?: string;
}

interface BlogFormResponse {
  title?: string;
  slug?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  postedBy?: string;
  status?: 'draft' | 'published';
  keyword?: string[];
  content?: string;
  faq?: FAQ[];
  socialMediaLinks?: SocialMediaLink[];
  resourceLinks?: ResourceLink[];
  banner?: UploadedFile;
  files?: UploadedFile[];
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  console.log('🔍 EditBlogPage - ID from params:', id);

  const { updateBlog, useGetBlogById } = useBlog();
  const { useGetBlogCategories } = useBlogCategory();
  const { user } = useAuth();
  const { useGetUserById } = useUser();
  
  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useGetBlogCategories();
  const categories = categoriesData?.data || [];

  // Fetch user data to get the name
  const { data: userData, isLoading: userLoading } = useGetUserById(user?.userId || '', {
    skip: !user?.userId
  });
  const userInfo = userData?.data;

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Create refs for each section
  const basicRef = useRef<HTMLDivElement>(null);
  const seoRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Create input refs for scrolling to errors
  const titleInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    category: '', // This will store the category slug
    postedBy: '',
    status: 'draft' as 'draft' | 'published',
    keywords: '',
    content: '',
  });

  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' }
  ]);

  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([
    { platform: '', url: '' }
  ]);

  const [resourceLinks, setResourceLinks] = useState<ResourceLink[]>([
    { title: '', url: '' }
  ]);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [existingBanner, setExistingBanner] = useState<UploadedFile | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [existingResources, setExistingResources] = useState<UploadedFile[]>([]);

  // Fetch blog data using the hook at the top level
  const { data: blogData, isLoading: fetching, refetch, error: fetchError } = useGetBlogById(id);

  // Debug logs
  useEffect(() => {
    console.log('📊 Blog data:', blogData);
    console.log('🔄 Fetching status:', fetching);
    console.log('❌ Fetch error:', fetchError);
  }, [blogData, fetching, fetchError]);

  // Set postedBy from authenticated user's name
  useEffect(() => {
    if (userInfo?.name) {
      setFormData(prev => ({
        ...prev,
        postedBy: userInfo.name
      }));
    } else if (user?.email) {
      setFormData(prev => ({
        ...prev,
        postedBy: user.email?.split('@')[0] || 'User'
      }));
    }
  }, [userInfo, user]);

  // Populate form data when blog data is loaded
  useEffect(() => {
    if (blogData?.data) {
      const blog = blogData.data as BlogFormResponse;
      console.log('✅ Blog loaded:', blog);

      // Populate form data
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        description: blog.description || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        category: blog.category || '',
        postedBy: blog.postedBy || userInfo?.name || '',
        status: blog.status || 'draft',
        keywords: blog.keyword ? blog.keyword.join(', ') : '',
        content: blog.content || '',
      });

      // Populate FAQs
      if (blog.faq && Array.isArray(blog.faq) && blog.faq.length > 0) {
        setFaqs(blog.faq);
      }

      // Populate Social Media Links
      if (blog.socialMediaLinks && Array.isArray(blog.socialMediaLinks) && blog.socialMediaLinks.length > 0) {
        setSocialMediaLinks(blog.socialMediaLinks);
      }

      // Populate Resource Links
      if (blog.resourceLinks && Array.isArray(blog.resourceLinks) && blog.resourceLinks.length > 0) {
        setResourceLinks(blog.resourceLinks);
      }

      // Populate uploaded files returned by the provider-neutral backend.
      if (blog.banner?.url && blog.banner?.storageKey) {
        setExistingBanner(blog.banner);
        setBannerPreview(blog.banner.url);
        setRemoveBanner(false);
      } else {
        setExistingBanner(null);
        setBannerPreview(null);
        setRemoveBanner(false);
      }

      if (blog.files && Array.isArray(blog.files)) {
        setExistingResources(blog.files);
      } else {
        setExistingResources([]);
      }
    }
  }, [blogData, userInfo]);

  // Refetch if ID changes
  useEffect(() => {
    if (id) {
      console.log('🔄 Refetching blog with ID:', id);
      refetch();
    }
  }, [id, refetch]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate slug if title changes and slug hasn't been manually edited
      if (name === 'title' && !isSlugManuallyEdited) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const sanitizedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug: sanitizedSlug }));
    setIsSlugManuallyEdited(true);
    
    if (validationErrors.slug) {
      setValidationErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, category: value }));
    
    if (validationErrors.category) {
      setValidationErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, description: value }));
    
    if (value.length < 10) {
      setValidationErrors(prev => ({ 
        ...prev, 
        description: 'Description must be at least 10 characters' 
      }));
    } else {
      setValidationErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);

    if (file) {
      setRemoveBanner(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(removeBanner ? null : existingBanner?.url || null);
    }
  };

  const handleResourceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const availableSlots = Math.max(
      0,
      10 - existingResources.length - resourceFiles.length,
    );
    const acceptedFiles = selectedFiles.slice(0, availableSlots);

    if (acceptedFiles.length < selectedFiles.length) {
      setError('A blog can contain at most 10 uploaded resource files.');
    }

    setResourceFiles(prev => [...prev, ...acceptedFiles]);
    e.target.value = '';
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingResource = (index: number) => {
    setExistingResources(prev => prev.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const addSocialMedia = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: '', url: '' }]);
  };

  const removeSocialMedia = (index: number) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  const updateSocialMedia = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updated = [...socialMediaLinks];
    updated[index][field] = value;
    setSocialMediaLinks(updated);
  };

  const addResourceLink = () => {
    setResourceLinks([...resourceLinks, { title: '', url: '' }]);
  };

  const removeResourceLink = (index: number) => {
    setResourceLinks(resourceLinks.filter((_, i) => i !== index));
  };

  const updateResourceLink = (index: number, field: keyof ResourceLink, value: string) => {
    const updated = [...resourceLinks];
    updated[index][field] = value;
    setResourceLinks(updated);
  };

  // Navigation function to scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      basic: basicRef,
      seo: seoRef,
      media: mediaRef,
      content: contentRef,
      links: linksRef,
      faq: faqRef,
    };

    const ref = refMap[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Scroll to specific input field
  const scrollToField = (fieldName: string) => {
    const fieldMap: Record<string, React.RefObject<HTMLElement | null>> = {
      title: titleInputRef,
      slug: slugInputRef,
      category: categorySelectRef,
      description: descriptionTextareaRef,
    };

    const ref = fieldMap[fieldName];
    if (ref && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      if (basicRef.current) {
        basicRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      errors.slug = 'Slug must use lowercase letters, numbers, and single hyphens';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.postedBy.trim()) {
      errors.postedBy = 'Posted By is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      scrollToField(firstErrorField);
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('🔄 Updating blog with ID:', id);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('slug', formData.slug.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('seoTitle', formData.seoTitle || '');
      formDataToSend.append('seoDescription', formData.seoDescription || '');
      formDataToSend.append('category', formData.category.trim()); // Sending slug
      formDataToSend.append('postedBy', formData.postedBy.trim());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('content', formData.content);

      // Send arrays as JSON so empty arrays can clear existing values.
      const keywords = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(Boolean);

      const validFaqs = faqs
        .map(faq => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }))
        .filter(faq => faq.question && faq.answer);

      const validSocialMediaLinks = socialMediaLinks
        .map(link => ({
          platform: link.platform.trim(),
          url: link.url.trim(),
        }))
        .filter(link => link.platform && link.url);

      const validResourceLinks = resourceLinks
        .map(link => ({
          title: link.title.trim(),
          url: link.url.trim(),
        }))
        .filter(link => link.title && link.url);

      formDataToSend.append('keyword', JSON.stringify(keywords));
      formDataToSend.append('faq', JSON.stringify(validFaqs));
      formDataToSend.append(
        'socialMediaLinks',
        JSON.stringify(validSocialMediaLinks),
      );
      formDataToSend.append(
        'resourceLinks',
        JSON.stringify(validResourceLinks),
      );

      // Tell the backend exactly which existing uploads are retained.
      formDataToSend.append(
        'retainedFileStorageKeys',
        JSON.stringify(
          existingResources
            .map(resource => resource.storageKey)
            .filter(Boolean),
        ),
      );
      formDataToSend.append('removeBanner', String(removeBanner));

      // Banner file
      if (bannerFile) {
        console.log('📸 Adding banner file:', bannerFile.name);
        formDataToSend.append('banner', bannerFile);
      }

      // New resource files
      resourceFiles.forEach(file => {
        console.log('📁 Adding resource file:', file.name);
        formDataToSend.append('resources', file);
      });

      console.log('📤 Sending blog update as multipart form data');

      const result = await updateBlog({ id, body: formDataToSend });
      
      console.log('✅ Blog updated:', result);
      
      setResponse(result);
      
      setTimeout(() => {
        router.push('/dashboard/blog');
      }, 2000);
    } catch (err: any) {
      console.error('❌ Error:', err);
      
      let errorMessage = err?.message || 'Failed to update blog. Please try again.';
      
      if (err?.data?.detail) {
        try {
          const details = JSON.parse(err.data.detail);
          if (Array.isArray(details) && details.length > 0) {
            const validationErrorsMap: Record<string, string> = {};
            details.forEach((detail: any) => {
              const field = detail.path?.join('.') || 'field';
              validationErrorsMap[field] = detail.message;
            });
            setValidationErrors(validationErrorsMap);
            errorMessage = 'Please fix the validation errors below.';
          }
        } catch (parseError) {
          errorMessage = err.data.detail || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'content', label: 'Content', icon: Layers },
    { id: 'links', label: 'Links & Social', icon: Link2 },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
  ];

  // Show loading state
  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  // Show error or not found state
  if (!blogData?.data && !fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/blog"
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-blue-600 text-white p-2 rounded-xl">
                  <FileText className="w-6 h-6" />
                </span>
                Edit Blog Post
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Update your blog post details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              type="submit"
              form="blog-form"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Post
                </>
              )}
            </button>
          </div>
        </div>

        {/* Response/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Error</p>
              <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {response && !error && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-700">Success!</p>
              <p className="text-sm text-emerald-600">Blog post updated successfully. Redirecting...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sections</p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span>{section.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div 
                ref={basicRef} 
                id="basic" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Essential details about your blog post</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={titleInputRef}
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog post title"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                        validationErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.title && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={slugInputRef}
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleSlugChange}
                        placeholder="my-blog-post"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                          validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {!isSlugManuallyEdited && formData.title && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500">
                          Auto
                        </span>
                      )}
                    </div>
                    {validationErrors.slug ? (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.slug}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">
                        URL-friendly: lowercase, numbers, hyphens only
                        {!isSlugManuallyEdited && formData.title && (
                          <span className="text-blue-500 ml-1">(auto-generated from title)</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      ref={categorySelectRef}
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white ${
                        validationErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      disabled={categoriesLoading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>
                    )}
                    {categoriesLoading && (
                      <p className="text-xs text-gray-400 mt-1">Loading categories...</p>
                    )}
                    {categories.length === 0 && !categoriesLoading && (
                      <p className="text-xs text-amber-600 mt-1">
                        No categories available. Please create a category first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Posted By <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="postedBy"
                        value={userLoading ? 'Loading...' : (formData.postedBy || '')}
                        onChange={handleInputChange}
                        placeholder="Author name"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                          validationErrors.postedBy ? 'border-red-500' : 'border-gray-300'
                        } ${!userLoading ? 'bg-gray-50' : 'bg-gray-100'}`}
                        required
                        disabled={!userLoading}
                      />
                    </div>
                    {validationErrors.postedBy && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.postedBy}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {userInfo?.name ? `Auto-filled as: ${userInfo.name}` : 'Auto-filled from your account'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">🚀 Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="technology, programming, web"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 ml-2">(minimum 10 characters)</span>
                  </label>
                  <textarea
                    ref={descriptionTextareaRef}
                    name="description"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    rows={3}
                    placeholder="Brief description of your blog post (minimum 10 characters)"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none ${
                      validationErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.description && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>
                  )}
                  {formData.description && formData.description.length > 0 && formData.description.length < 10 && (
                    <p className="text-xs text-amber-500 mt-1">
                      {formData.description.length}/10 characters minimum
                    </p>
                  )}
                  {formData.description && formData.description.length >= 10 && (
                    <p className="text-xs text-emerald-500 mt-1">
                      ✓ {formData.description.length} characters
                    </p>
                  )}
                </div>
              </div>

              {/* SEO Section */}
              <div 
                ref={seoRef} 
                id="seo" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
                    <p className="text-sm text-gray-500">Optimize your blog for search engines</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      placeholder="SEO optimized title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="SEO optimized description"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div 
                ref={mediaRef} 
                id="media" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Media</h2>
                    <p className="text-sm text-gray-500">Upload banner and resource files</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        bannerPreview ? 'border-blue-300 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}>
                        {bannerPreview ? (
                          <div className="relative">
                            <img src={bannerPreview} alt="Banner preview" className="max-h-48 mx-auto rounded-lg" />
                            {existingBanner && !removeBanner && !bannerFile && (
                              <span className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                Current Banner
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (bannerFile) {
                                  setBannerFile(null);
                                  setBannerPreview(
                                    removeBanner ? null : existingBanner?.url || null,
                                  );
                                  return;
                                }

                                if (existingBanner) {
                                  setRemoveBanner(true);
                                  setBannerPreview(null);
                                }
                              }}
                              className="absolute top-2 right-2 z-20 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-600">
                              {existingBanner && !removeBanner
                                ? 'Upload new banner or keep existing'
                                : 'Click to upload banner'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resource Files */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Resource Files</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        onChange={handleResourceFilesChange}
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                        <div className="flex flex-col items-center">
                          <Upload className="w-10 h-10 text-gray-300 mb-2" />
                          <p className="text-sm font-medium text-gray-600">
                            {existingResources.length > 0 ? 'Upload new resources or keep existing' : 'Upload resources'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Images, videos, PDFs, documents (max 10 files)</p>
                        </div>
                      </div>
                    </div>

                    {/* Existing Resources */}
                    {existingResources.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500">Current Resources</p>
                        {existingResources.map((resource, index) => (
                          <div key={resource.storageKey || `existing-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 truncate">
                                {resource.originalName || resource.url.split('/').pop() || `Resource ${index + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingResource(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Resources */}
                    {resourceFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500">New Resources</p>
                        {resourceFiles.map((file, index) => (
                          <div key={`new-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeResourceFile(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div 
                ref={contentRef} 
                id="content" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                    <p className="text-sm text-gray-500">Write your blog post content</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Content <span className="text-red-500">*</span>
                  </label>
                  {showPreview ? (
                    <ContentPreview html={formData.content} className="rounded-xl border border-gray-200 p-5" />
                  ) : (
                    <RichTextEditor
                      value={formData.content}
                      onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                      placeholder="<h2>Section 1</h2><p>Your content here...</p>"
                    />
                  )}
                  {validationErrors.content && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.content}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">Use the visual editor, or switch to Source to paste raw HTML. Insert images via upload or URL. Toggle Preview to see the live layout.</p>
                </div>
              </div>

              {/* Links & Social Section */}
              <div 
                ref={linksRef} 
                id="links" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Link2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Links & Social</h2>
                    <p className="text-sm text-gray-500">Add social media and resource links</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Social Media Links */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Social Media Links</label>
                      <button
                        type="button"
                        onClick={addSocialMedia}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    {socialMediaLinks.map((link, index) => (
                      <div key={index} className="flex gap-3 mb-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={link.platform}
                            onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                            placeholder="Platform (e.g., Twitter)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                        </div>
                        {socialMediaLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Resource Links */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Resource Links</label>
                      <button
                        type="button"
                        onClick={addResourceLink}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    {resourceLinks.map((link, index) => (
                      <div key={index} className="flex gap-3 mb-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateResourceLink(index, 'title', e.target.value)}
                            placeholder="Resource Title"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateResourceLink(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                        </div>
                        {resourceLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeResourceLink(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div 
                ref={faqRef} 
                id="faq" 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 scroll-mt-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
                    <p className="text-sm text-gray-500">Frequently asked questions about this blog</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            placeholder="Question"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            rows={2}
                            placeholder="Answer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                          />
                        </div>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 h-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    + Add FAQ
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <Link
                  href="/dashboard/blog"
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-center hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    'Update Blog Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
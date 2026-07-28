'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Link2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Hash,
  Tag,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Layers,
  File,
  Video,
  BookOpen,
  Clipboard,
  Check,
  Sparkles,
  Award,
  Wrench,
  FileJson
} from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ContentPreview from '@/components/editor/ContentPreview';
import { useCourseCategory } from '@/features/courseCategory/hooks/useCourseCategory';
import StringListEditor from '@/components/dashboard/course/StringListEditor';
import CurriculumBuilder from '@/components/dashboard/course/CurriculumBuilder';
import type {
  IHighlight,
  ITool,
  ICurriculumSection,
  IProject,
  ICertificate,
  ITestimonial,
  CourseLevel,
} from '@/features/course/api/courseApi';

interface UploadedFile {
  url: string;
  storageKey: string;
  mimeType?: string;
  originalName?: string;
  size?: number;
  extension?: string;
  uploadedAt?: string;
  etag?: string;
  width?: number;
  height?: number;
  duration?: number;
  pages?: number;
}

interface Resource {
  name: string;
  type: 'pdf' | 'image';
  file: UploadedFile;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CourseFormData {
  title: string;
  slug: string;
  category: string; // This will store the category slug
  subCategory: string;
  shortDescription: string;
  price: number;
  discountedPrice: number;
  currency: string;
  purchaseUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: 'upcoming' | 'active' | 'ended';
  urls: string[];
  cms: string;
  bannerImage?: UploadedFile;
  resources: Resource[];
  faqs: FAQ[];

  // Landing page content
  heroHeadline: string;
  highlights: IHighlight[];
  whatYouWillLearn: string[];
  requirements: string[];
  whoIsThisFor: string[];
  notFor: string[];
  tools: ITool[];
  curriculum: ICurriculumSection[];
  projects: IProject[];
  certificate: ICertificate;
  careerRoles: string[];
  testimonials: ITestimonial[];

  // Delivery
  level: CourseLevel;
  language: string;
  durationWeeks: number;
  format: string;
}

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: FormData) => void;
  loading: boolean;
  isEdit?: boolean;
}

const COURSE_LEVELS = new Set<CourseLevel>([
  'all-levels',
  'beginner',
  'intermediate',
  'advanced',
]);

const normalizeCourseLevel = (value: unknown): CourseLevel => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  return COURSE_LEVELS.has(normalized as CourseLevel)
    ? (normalized as CourseLevel)
    : 'all-levels';
};

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  loading,
  isEdit = false
}) => {
  // Create refs for each section
  const basicRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const seoRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const outcomesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  // Create input refs for scrolling to errors
  const titleInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const shortDescriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch categories
  const { useGetCourseCategories } = useCourseCategory();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCourseCategories();
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    slug: '',
    category: '',
    subCategory: '',
    shortDescription: '',
    price: 0,
    discountedPrice: 0,
    currency: 'INR',
    purchaseUrl: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    status: 'upcoming',
    urls: [],
    cms: '',
    resources: [],
    faqs: [],
    heroHeadline: '',
    highlights: [],
    whatYouWillLearn: [],
    requirements: [],
    whoIsThisFor: [],
    notFor: [],
    tools: [],
    curriculum: [],
    projects: [],
    certificate: { description: '', requirements: [] },
    careerRoles: [],
    testimonials: [],
    level: 'all-levels',
    language: 'English',
    durationWeeks: 0,
    format: ''
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Bulk FAQ import states
  const [showBulkFaqImport, setShowBulkFaqImport] = useState(false);
  const [bulkFaqInput, setBulkFaqInput] = useState('');
  const [bulkImportError, setBulkImportError] = useState('');
  const [bulkImportSuccess, setBulkImportSuccess] = useState(false);

  // Full course JSON import states
  const [showCourseJsonImport, setShowCourseJsonImport] = useState(false);
  const [courseJsonInput, setCourseJsonInput] = useState('');
  const [courseJsonError, setCourseJsonError] = useState('');
  const [courseJsonSuccess, setCourseJsonSuccess] = useState(false);

  // Load initial data.
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        level: normalizeCourseLevel(initialData.level),
        purchaseUrl: initialData.purchaseUrl ?? '',
        highlights: initialData.highlights ?? [],
        whatYouWillLearn: initialData.whatYouWillLearn ?? [],
        requirements: initialData.requirements ?? [],
        whoIsThisFor: initialData.whoIsThisFor ?? [],
        notFor: initialData.notFor ?? [],
        tools: initialData.tools ?? [],
        curriculum: initialData.curriculum ?? [],
        projects: initialData.projects ?? [],
        careerRoles: initialData.careerRoles ?? [],
        testimonials: initialData.testimonials ?? [],
        keywords: initialData.keywords ?? [],
        urls: initialData.urls ?? [],
        resources: (initialData.resources ?? []).map((resource) => ({
          ...resource,
          file: {
            ...resource.file,
            url: resource.file?.url ?? '',
            storageKey: resource.file?.storageKey ?? '',
          },
        })),
        faqs: initialData.faqs ?? [],
        certificate: {
          description: initialData.certificate?.description ?? '',
          requirements: initialData.certificate?.requirements ?? [],
        },
      }));
      setRemoveBanner(false);
      if (initialData.bannerImage?.url) {
        setBannerPreview(initialData.bannerImage.url);
      }
      if (initialData.slug) {
        setIsSlugManuallyEdited(true);
      }
    }
  }, [initialData]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    const refMap = {
      basic: basicRef,
      pricing: pricingRef,
      media: mediaRef,
      seo: seoRef,
      landing: landingRef,
      curriculum: curriculumRef,
      outcomes: outcomesRef,
      content: contentRef,
      resources: resourcesRef,
      faqs: faqsRef,
    };

    const ref = refMap[sectionId as keyof typeof refMap];
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
      shortDescription: shortDescriptionTextareaRef,
    };

    if (fieldName === 'bannerImage' && mediaRef.current) {
      mediaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (fieldName === 'resources' && resourcesRef.current) {
      resourcesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const ref = fieldMap[fieldName];
    if (ref?.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    basicRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const resetBannerSelection = () => {
    setBannerFile(null);
    setRemoveBanner(false);
    setBannerPreview(isEdit ? initialData?.bannerImage?.url ?? null : null);
  };

  const removeBannerSelection = () => {
    setBannerFile(null);
    setRemoveBanner(Boolean(isEdit && initialData?.bannerImage));
    setBannerPreview(null);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      resetBannerSelection();
      return;
    }

    setBannerFile(file);
    setRemoveBanner(false);
    if (validationErrors.bannerImage) {
      setValidationErrors((prev) => ({ ...prev, bannerImage: '' }));
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isPersistedResource = (resource: Resource) =>
    Boolean(resource.file.storageKey?.trim() || resource.file.url?.trim());

  const handleResourceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []) as File[];
    if (!selectedFiles.length) return;

    const availableSlots = Math.max(19 - formData.resources.length, 0);
    const files = selectedFiles.slice(0, availableSlots);

    if (files.length < selectedFiles.length) {
      setValidationErrors((prev) => ({
        ...prev,
        resources: 'A course can contain a maximum of 19 resources.',
      }));
    } else if (validationErrors.resources) {
      setValidationErrors((prev) => ({ ...prev, resources: '' }));
    }

    if (!files.length) {
      e.target.value = '';
      return;
    }

    const newResources: Resource[] = files.map((file) => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
      file: {
        url: '',
        storageKey: '',
      },
    }));

    setResourceFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, ...newResources],
    }));

    // Allows selecting the same file again after removing it.
    e.target.value = '';
  };

  const removeResourceFile = (index: number) => {
    const resourceToRemove = formData.resources[index];
    if (!resourceToRemove) return;

    if (!isPersistedResource(resourceToRemove)) {
      const pendingFileIndex = formData.resources
        .slice(0, index)
        .filter((resource) => !isPersistedResource(resource)).length;

      setResourceFiles((prev) =>
        prev.filter((_, fileIndex) => fileIndex !== pendingFileIndex),
      );
    }

    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, resourceIndex) => resourceIndex !== index),
    }));

    if (validationErrors.resources) {
      setValidationErrors((prev) => ({ ...prev, resources: '' }));
    }
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    setFormData(prev => {
      const updatedFaqs = prev.faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, [field]: value };
        }
        return faq;
      });
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string');

  const importCourseJson = (rawJson: string) => {
    const parsed = JSON.parse(rawJson);
    const imported =
      parsed?.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)
        ? parsed.data
        : parsed;

    if (!imported || typeof imported !== 'object' || Array.isArray(imported)) {
      throw new Error('The JSON root must be an object.');
    }

    setFormData((prev) => {
      const next: CourseFormData = { ...prev };

      // Safe text fields.
      const textFields: Array<keyof CourseFormData> = [
        'title',
        'slug',
        'subCategory',
        'shortDescription',
        'purchaseUrl',
        'metaTitle',
        'metaDescription',
        'cms',
        'heroHeadline',
        'language',
        'format',
      ];

      textFields.forEach((field) => {
        const value = imported[field];
        if (typeof value === 'string') {
          (next[field] as string) = value;
        }
      });

      // Slug is normalized. If missing, generate it from title.
      if (typeof imported.slug === 'string' && imported.slug.trim()) {
        next.slug = generateSlug(imported.slug);
        setIsSlugManuallyEdited(true);
      } else if (typeof imported.title === 'string' && imported.title.trim()) {
        next.slug = generateSlug(imported.title);
        setIsSlugManuallyEdited(false);
      }

      // Safe numeric fields.
      if (typeof imported.price === 'number' && Number.isFinite(imported.price)) {
        next.price = imported.price;
      }
      if (
        typeof imported.discountedPrice === 'number' &&
        Number.isFinite(imported.discountedPrice)
      ) {
        next.discountedPrice = imported.discountedPrice;
      }
      if (
        typeof imported.durationWeeks === 'number' &&
        Number.isFinite(imported.durationWeeks)
      ) {
        next.durationWeeks = imported.durationWeeks;
      }

      // String lists.
      (
        [
          'keywords',
          'urls',
          'whatYouWillLearn',
          'requirements',
          'whoIsThisFor',
          'notFor',
          'careerRoles',
        ] as const
      ).forEach((field) => {
        if (isStringArray(imported[field])) {
          next[field] = imported[field]
            .map((item: string) => item.trim())
            .filter(Boolean);
        }
      });

      // Structured landing-page fields.
      if (Array.isArray(imported.highlights)) {
        next.highlights = imported.highlights
          .filter(
            (item: unknown) =>
              item &&
              typeof item === 'object' &&
              typeof (item as IHighlight).label === 'string' &&
              typeof (item as IHighlight).value === 'string',
          )
          .map((item: IHighlight) => ({
            label: item.label.trim(),
            value: item.value.trim(),
          }));
      }

      if (Array.isArray(imported.tools)) {
        next.tools = imported.tools
          .filter(
            (item: unknown) =>
              item &&
              typeof item === 'object' &&
              typeof (item as ITool).name === 'string',
          )
          .map((item: ITool) => ({
            ...item,
            name: item.name.trim(),
            iconSlug:
              typeof item.iconSlug === 'string'
                ? item.iconSlug.trim().toLowerCase()
                : '',
          }));
      }

      if (Array.isArray(imported.curriculum)) {
        next.curriculum = imported.curriculum as ICurriculumSection[];
      }

      if (Array.isArray(imported.projects)) {
        next.projects = imported.projects
          .filter(
            (item: unknown) =>
              item &&
              typeof item === 'object' &&
              typeof (item as IProject).title === 'string',
          )
          .map((item: IProject) => ({
            ...item,
            title: item.title.trim(),
            description:
              typeof item.description === 'string'
                ? item.description.trim()
                : '',
          }));
      }

      if (Array.isArray(imported.testimonials)) {
        next.testimonials = imported.testimonials
          .filter(
            (item: unknown) =>
              item &&
              typeof item === 'object' &&
              typeof (item as ITestimonial).name === 'string' &&
              typeof (item as ITestimonial).content === 'string',
          )
          .map((item: ITestimonial) => ({
            ...item,
            name: item.name.trim(),
            content: item.content.trim(),
            role: typeof item.role === 'string' ? item.role.trim() : '',
            company:
              typeof item.company === 'string' ? item.company.trim() : '',
            rating:
              typeof item.rating === 'number' &&
              item.rating >= 1 &&
              item.rating <= 5
                ? item.rating
                : 5,
          }));
      }

      if (
        imported.certificate &&
        typeof imported.certificate === 'object' &&
        !Array.isArray(imported.certificate)
      ) {
        next.certificate = {
          description:
            typeof imported.certificate.description === 'string'
              ? imported.certificate.description.trim()
              : '',
          requirements: isStringArray(imported.certificate.requirements)
            ? imported.certificate.requirements
                .map((item: string) => item.trim())
                .filter(Boolean)
            : [],
        };
      }

      // Append valid imported FAQs instead of replacing existing FAQs.
      const importedFaqs = imported.faqs ?? imported.faq;
      if (Array.isArray(importedFaqs)) {
        const validFaqs = importedFaqs
          .filter(
            (item: unknown) =>
              item &&
              typeof item === 'object' &&
              typeof (item as FAQ).question === 'string' &&
              typeof (item as FAQ).answer === 'string',
          )
          .map((item: FAQ) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
          }))
          .filter((item: FAQ) => item.question && item.answer);

        next.faqs = [...prev.faqs, ...validFaqs];
      }

      // Intentionally skipped:
      // category, status, currency and level (select fields);
      // bannerImage, resources and all local file inputs.
      return next;
    });

    setValidationErrors({});
  };

  const handleCourseJsonImport = () => {
    setCourseJsonError('');
    setCourseJsonSuccess(false);

    try {
      importCourseJson(courseJsonInput);
      setCourseJsonSuccess(true);
      setCourseJsonInput('');

      window.setTimeout(() => {
        setCourseJsonSuccess(false);
        setShowCourseJsonImport(false);
      }, 1200);
    } catch (error) {
      setCourseJsonError(
        error instanceof SyntaxError
          ? 'Invalid JSON format. Please check your syntax.'
          : error instanceof Error
            ? error.message
            : 'Failed to import course JSON.',
      );
    }
  };

  const exampleCourseJson = `{
  "title": "Complete Digital Marketing Course",
  "slug": "complete-digital-marketing-course",
  "subCategory": "Performance Marketing",
  "shortDescription": "Learn practical digital marketing with campaigns, analytics, SEO and conversion optimization.",
  "price": 19999,
  "discountedPrice": 14999,
  "purchaseUrl": "https://example.com/checkout",
  "metaTitle": "Complete Digital Marketing Course",
  "metaDescription": "Build job-ready digital marketing skills through practical projects.",
  "keywords": ["digital marketing", "SEO", "Google Ads"],
  "urls": ["https://example.com/course-outline"],
  "cms": "<h2>About this course</h2><p>This is sample HTML content for testing.</p>",
  "heroHeadline": "Build campaigns that turn attention into measurable growth",
  "language": "English",
  "durationWeeks": 8,
  "format": "Live cohort",
  "highlights": [
    { "label": "Duration", "value": "8 Weeks" },
    { "label": "Projects", "value": "4 Live Projects" }
  ],
  "whatYouWillLearn": [
    "Plan a complete digital marketing funnel",
    "Launch and optimize paid campaigns"
  ],
  "requirements": ["Laptop with internet access"],
  "whoIsThisFor": ["Students", "Marketing professionals"],
  "notFor": ["People looking only for theory"],
  "tools": [
    { "name": "Google Ads", "iconSlug": "googleads" },
    { "name": "Google Analytics", "iconSlug": "googleanalytics" }
  ],
  "curriculum": [],
  "projects": [
    {
      "title": "Campaign Strategy Project",
      "description": "Create a complete paid campaign strategy for a sample brand."
    }
  ],
  "careerRoles": ["Digital Marketer", "Performance Marketer"],
  "testimonials": [
    {
      "name": "Demo Student",
      "role": "Marketing Executive",
      "company": "Example Company",
      "content": "The practical assignments helped me understand campaign execution.",
      "rating": 5
    }
  ],
  "certificate": {
    "description": "Certificate awarded after successful course completion.",
    "requirements": ["Complete all assignments", "Attend at least 80% of sessions"]
  },
  "faqs": [
    {
      "question": "Is this course beginner friendly?",
      "answer": "Yes, the course starts with fundamentals and progresses to practical execution."
    }
  ]
}`;

  const handleBulkFaqImport = () => {
    setBulkImportError('');
    setBulkImportSuccess(false);
    
    try {
      const parsedData = JSON.parse(bulkFaqInput);
      
      let faqsArray: any[] = [];
      
      if (Array.isArray(parsedData)) {
        faqsArray = parsedData;
      } else if (parsedData.faqs && Array.isArray(parsedData.faqs)) {
        faqsArray = parsedData.faqs;
      } else {
        throw new Error('Invalid format: Expected an array of FAQs or an object with a "faqs" array');
      }
      
      const validFaqs: FAQ[] = [];
      const errors: string[] = [];
      
      faqsArray.forEach((item, index) => {
        if (item.question && item.answer) {
          validFaqs.push({
            question: item.question.trim(),
            answer: item.answer.trim()
          });
        } else {
          errors.push(`FAQ #${index + 1}: Missing 'question' or 'answer' field`);
        }
      });
      
      if (errors.length > 0) {
        setBulkImportError(`Some FAQs were skipped: ${errors.join('; ')}`);
      }
      
      if (validFaqs.length === 0) {
        setBulkImportError('No valid FAQs found. Each FAQ must have a "question" and "answer" field.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, ...validFaqs]
      }));
      
      setBulkImportSuccess(true);
      setBulkFaqInput('');
      
      setTimeout(() => {
        setBulkImportSuccess(false);
      }, 3000);
      
      setTimeout(() => {
        setShowBulkFaqImport(false);
      }, 1500);
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        setBulkImportError('Invalid JSON format. Please check your syntax.');
      } else {
        setBulkImportError(error instanceof Error ? error.message : 'Failed to import FAQs');
      }
    }
  };

  const exampleFaqJson = `[
  {
    "question": "What is the duration of this course?",
    "answer": "The course consists of 40 hours of video content, spread across 12 modules."
  },
  {
    "question": "Is there any prerequisite for this course?",
    "answer": "Basic knowledge of programming is recommended, but not mandatory."
  },
  {
    "question": "Will I get a certificate after completion?",
    "answer": "Yes, you will receive a verified certificate upon completing all modules and assignments."
  }
]`;

  const updateResource = (
    index: number,
    field: 'name' | 'type',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.map((resource, resourceIndex) =>
        resourceIndex === index
          ? { ...resource, [field]: value }
          : resource,
      ),
    }));

    if (field === 'name' && value.trim() && validationErrors.resources) {
      setValidationErrors((prev) => ({ ...prev, resources: '' }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        urls: [...prev.urls, urlInput.trim()]
      }));
      setUrlInput('');
    }
  };

  const removeUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      errors.slug = 'Use lowercase letters, numbers, and single hyphens only';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      scrollToField(firstErrorField);
      return;
    }
    
    const formDataToSend = new FormData();

    const handledSeparately = new Set([
      'keywords',
      'urls',
      'resources',
      'faqs',
      'highlights',
      'tools',
      'curriculum',
      'projects',
      'certificate',
      'testimonials',
      'whatYouWillLearn',
      'requirements',
      'whoIsThisFor',
      'notFor',
      'careerRoles',
      'bannerImage',
    ]);

    Object.keys(formData).forEach((key) => {
      if (handledSeparately.has(key)) return;

      const value = formData[key as keyof CourseFormData];

      if (value === undefined || value === null) return;

      if (key === 'level') {
        formDataToSend.append('level', normalizeCourseLevel(value));
        return;
      }

      formDataToSend.append(key, String(value));
    });

    formData.keywords.forEach(keyword => {
      formDataToSend.append('keywords[]', keyword);
    });

    formData.urls.forEach(url => {
      formDataToSend.append('urls[]', url);
    });

    formDataToSend.append('faqs', JSON.stringify(formData.faqs));

    // The backend reconciles retained resources first, then pairs newly
    // selected files with the remaining metadata entries in upload order.
    const retainedResources = formData.resources.filter(isPersistedResource);
    const pendingResources = formData.resources.filter(
      (resource) => !isPersistedResource(resource),
    );

    const resourceMetadata = [...retainedResources, ...pendingResources].map(
      (resource) => ({
        name: resource.name,
        type: resource.type,
        ...(isPersistedResource(resource)
          ? {
              file: {
                ...(resource.file.storageKey
                  ? { storageKey: resource.file.storageKey }
                  : {}),
                ...(resource.file.url ? { url: resource.file.url } : {}),
              },
            }
          : {}),
      }),
    );

    formDataToSend.append('resources', JSON.stringify(resourceMetadata));

    (['whatYouWillLearn', 'requirements', 'whoIsThisFor', 'notFor', 'careerRoles'] as const).forEach(field => {
      formData[field].forEach(item => {
        formDataToSend.append(`${field}[]`, item);
      });
    });

    formDataToSend.append('highlights', JSON.stringify(formData.highlights));
    formDataToSend.append('tools', JSON.stringify(formData.tools));
    formDataToSend.append('curriculum', JSON.stringify(formData.curriculum));
    formDataToSend.append('projects', JSON.stringify(formData.projects));
    formDataToSend.append('certificate', JSON.stringify(formData.certificate));
    formDataToSend.append('testimonials', JSON.stringify(formData.testimonials));

    formDataToSend.append('removeBanner', String(removeBanner));

    if (bannerFile) {
      formDataToSend.append('bannerImage', bannerFile);
    }

    resourceFiles.forEach(file => {
      formDataToSend.append('resources', file);
    });

    onSubmit(formDataToSend);
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'landing', label: 'Landing Page', icon: Sparkles },
    { id: 'curriculum', label: 'Curriculum', icon: Video },
    { id: 'outcomes', label: 'Outcomes', icon: Award },
    { id: 'content', label: 'Content', icon: Layers },
    { id: 'resources', label: 'Resources', icon: File },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowCourseJsonImport(true);
              setCourseJsonError('');
              setCourseJsonSuccess(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium"
          >
            <FileJson className="w-4 h-4" />
            Import Course JSON
          </button>

          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Info Section */}
      <div 
        ref={basicRef} 
        id="basic" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
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
              placeholder="Enter course title"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
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
                placeholder="course-slug"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                  validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {!isSlugManuallyEdited && formData.title && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-500">
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
                  <span className="text-teal-500 ml-1">(auto-generated from title)</span>
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
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white ${
                validationErrors.category ? 'border-red-500' : 'border-gray-300'
              }`}
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
              Sub Category
            </label>
            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              placeholder="e.g., Frontend"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description
            </label>
            <textarea
              ref={shortDescriptionTextareaRef}
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the course"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none ${
                validationErrors.shortDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.shortDescription && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.shortDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
            >
              <option value="upcoming">📅 Upcoming</option>
              <option value="active">✅ Active</option>
              <option value="ended">❌ Ended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div 
        ref={pricingRef} 
        id="pricing" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0"
                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.01"
              />
            </div>
            {validationErrors.price && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Discounted Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleNumberChange}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Set to 0 for no discount</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Purchase / Buy Link
          </label>
          <input
            type="url"
            name="purchaseUrl"
            value={formData.purchaseUrl}
            onChange={handleInputChange}
            placeholder="https://learning.skillo.live/checkout/..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            External checkout URL the &quot;Buy&quot; button links to. Leave empty to hide the buy button.
          </p>
        </div>
      </div>

      {/* Media Section */}
      <div 
        ref={mediaRef} 
        id="media" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        
        {/* Banner Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Banner Image
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              bannerPreview ? 'border-teal-300 bg-teal-50/50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/30'
            }`}>
              {bannerPreview ? (
                <div className="relative">
                  <img src={bannerPreview} alt="Banner preview" className="max-h-64 mx-auto rounded-lg" />
                  {isEdit && !removeBanner && !bannerFile && initialData?.bannerImage && (
                    <span className="absolute top-2 left-2 text-xs bg-teal-600 text-white px-2 py-1 rounded">
                      Current Banner
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (bannerFile) {
                        resetBannerSelection();
                      } else {
                        removeBannerSelection();
                      }
                    }}
                    className="absolute top-2 right-2 z-20 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label={bannerFile ? 'Restore current banner' : 'Remove banner'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">Click to upload banner image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          </div>
          {validationErrors.bannerImage && (
            <p className="text-xs text-red-500 mt-2">{validationErrors.bannerImage}</p>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div 
        ref={seoRef} 
        id="seo" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="SEO optimized title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={2}
              placeholder="SEO optimized description"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Add a keyword"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Landing Page Section - Keep as is */}
      <div
        ref={landingRef}
        id="landing"
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Landing Page</h3>
        <p className="text-xs text-gray-400 mb-5">
          Each block below hides itself on the course page when left empty.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Headline</label>
            <input
              type="text"
              name="heroHeadline"
              value={formData.heroHeadline}
              onChange={handleInputChange}
              placeholder="Turn raw data into decisions employers pay for"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              The promise at the top of the page. Falls back to the course title if empty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all-levels">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                placeholder="English"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (weeks)</label>
              <input
                type="number"
                min={0}
                name="durationWeeks"
                value={formData.durationWeeks || ''}
                onChange={handleNumberChange}
                placeholder="6"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Format</label>
              <input
                type="text"
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                placeholder="Live cohort"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">At a Glance</label>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    highlights: [...prev.highlights, { label: '', value: '' }],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Stat tiles shown under the hero, e.g. Duration / 6 Weeks.
            </p>
            <div className="space-y-2">
              {formData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={h.label}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        highlights: prev.highlights.map((x, j) =>
                          j === i ? { ...x, label: e.target.value } : x,
                        ),
                      }))
                    }
                    placeholder="Duration"
                    className="w-1/3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        highlights: prev.highlights.map((x, j) =>
                          j === i ? { ...x, value: e.target.value } : x,
                        ),
                      }))
                    }
                    placeholder="6 Weeks"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        highlights: prev.highlights.filter((_, j) => j !== i),
                      }))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                    aria-label="Remove highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <StringListEditor
            label="What You'll Learn"
            value={formData.whatYouWillLearn}
            onChange={(next) => setFormData(prev => ({ ...prev, whatYouWillLearn: next }))}
            placeholder="Build and ship a live Meta ad campaign"
            example="One outcome per line. These render as a two-column checklist."
          />

          <StringListEditor
            label="Requirements"
            value={formData.requirements}
            onChange={(next) => setFormData(prev => ({ ...prev, requirements: next }))}
            placeholder="A laptop with a reliable internet connection"
            example="What a learner needs before starting: hardware, prior knowledge, time commitment."
          />

          <StringListEditor
            label="Who This Is For"
            value={formData.whoIsThisFor}
            onChange={(next) => setFormData(prev => ({ ...prev, whoIsThisFor: next }))}
            placeholder="Marketers moving from execution into strategy"
          />

          <StringListEditor
            label="Who This Is NOT For"
            value={formData.notFor}
            onChange={(next) => setFormData(prev => ({ ...prev, notFor: next }))}
            placeholder="Anyone looking for a purely theoretical course"
            example="Optional. Being explicit about fit reduces refund requests."
          />

          {/* Tools */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Tools Covered</label>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({ ...prev, tools: [...prev.tools, { name: '', iconSlug: '' }] }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Icon slug is a{' '}
              <a
                href="https://simpleicons.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-teal-600"
              >
                simpleicons.org
              </a>{' '}
              name (e.g. googleads, figma). Leave blank to show initials instead.
            </p>
            <div className="space-y-2">
              {formData.tools.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        tools: prev.tools.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                      }))
                    }
                    placeholder="Google Ads"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={t.iconSlug || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        tools: prev.tools.map((x, j) =>
                          j === i ? { ...x, iconSlug: e.target.value.toLowerCase().trim() } : x,
                        ),
                      }))
                    }
                    placeholder="googleads"
                    className="w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, tools: prev.tools.filter((_, j) => j !== i) }))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                    aria-label="Remove tool"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section - Keep as is */}
      <div
        ref={curriculumRef}
        id="curriculum"
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <CurriculumBuilder
          value={formData.curriculum}
          onChange={(next) => setFormData(prev => ({ ...prev, curriculum: next }))}
        />
      </div>

      {/* Outcomes Section - Keep as is */}
      <div
        ref={outcomesRef}
        id="outcomes"
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Outcomes</h3>

        <div className="space-y-6">
          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Projects</label>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    projects: [...prev.projects, { title: '', description: '' }],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.projects.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          projects: prev.projects.map((x, j) =>
                            j === i ? { ...x, title: e.target.value } : x,
                          ),
                        }))
                      }
                      placeholder="Project title"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          projects: prev.projects.filter((_, j) => j !== i),
                        }))
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                      aria-label="Remove project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={p.description || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        projects: prev.projects.map((x, j) =>
                          j === i ? { ...x, description: e.target.value } : x,
                        ),
                      }))
                    }
                    rows={2}
                    placeholder="What the learner builds and keeps"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          <StringListEditor
            label="Career Roles"
            value={formData.careerRoles}
            onChange={(next) => setFormData(prev => ({ ...prev, careerRoles: next }))}
            placeholder="Performance Marketer"
            example="Roles this course prepares learners for."
          />

          {/* Testimonials */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Testimonials</label>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    testimonials: [
                      ...prev.testimonials,
                      { name: '', role: '', company: '', content: '', rating: 5 },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Course-specific success stories shown in the sliding carousel on the course page.
            </p>
            <div className="space-y-3">
              {formData.testimonials.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        }))
                      }
                      placeholder="Name"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    <select
                      value={t.rating ?? 5}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.map((x, j) =>
                            j === i ? { ...x, rating: Number(e.target.value) } : x,
                          ),
                        }))
                      }
                      className="w-28 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} ★</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.filter((_, j) => j !== i),
                        }))
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                      aria-label="Remove testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={t.role || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.map((x, j) =>
                            j === i ? { ...x, role: e.target.value } : x,
                          ),
                        }))
                      }
                      placeholder="Role (e.g. Performance Marketer)"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                    <input
                      type="text"
                      value={t.company || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.map((x, j) =>
                            j === i ? { ...x, company: e.target.value } : x,
                          ),
                        }))
                      }
                      placeholder="Company"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                  <textarea
                    value={t.content}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        testimonials: prev.testimonials.map((x, j) =>
                          j === i ? { ...x, content: e.target.value } : x,
                        ),
                      }))
                    }
                    rows={2}
                    placeholder="What they said about the course"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Certificate */}
          <div className="rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate</label>
            <textarea
              value={formData.certificate.description || ''}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  certificate: { ...prev.certificate, description: e.target.value },
                }))
              }
              rows={2}
              placeholder="What the certificate represents"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-y mb-3"
            />
            <StringListEditor
              label="Requirements to Earn It"
              value={formData.certificate.requirements || []}
              onChange={(next) =>
                setFormData(prev => ({
                  ...prev,
                  certificate: { ...prev.certificate, requirements: next },
                }))
              }
              placeholder="Attend 80% of live sessions"
            />
          </div>
        </div>
      </div>

      {/* Content Section - Keep as is */}
      <div
        ref={contentRef}
        id="content"
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Content</h3>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Additional Content
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Only for content unique to this course that the structured blocks above
            don&apos;t cover — comparison tables, extended narrative. Renders as one
            collapsible section on the page, so don&apos;t duplicate the curriculum or
            outcomes here.
          </p>
          {showPreview ? (
            <ContentPreview html={formData.cms} className="rounded-xl border border-gray-200 p-5" />
          ) : (
            <RichTextEditor
              value={formData.cms}
              onChange={(html) => setFormData((prev) => ({ ...prev, cms: html }))}
              placeholder="<h2>Welcome to the course</h2><p>Course content goes here...</p>"
            />
          )}
          <p className="text-xs text-gray-400 mt-1.5">Use the visual editor, or switch to Source to paste raw HTML. Insert images via upload or URL.</p>
        </div>

        {/* URLs */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">External URLs</label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.urls.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600 truncate flex-1">{url}</span>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Section - Keep as is */}
      <div 
        ref={resourcesRef} 
        id="resources" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload Resources
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleResourceFilesChange}
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all">
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">Upload resources</p>
                <p className="text-xs text-gray-400 mt-1">PDF or Image files (max 19 files)</p>
              </div>
            </div>
          </div>
          {validationErrors.resources && (
            <p className="text-xs text-red-500 mt-2">{validationErrors.resources}</p>
          )}

          {/* Resource List */}
          {formData.resources.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                    {resource.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-teal-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => updateResource(index, 'name', e.target.value)}
                    placeholder="Resource name"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <select
                    value={resource.type}
                    onChange={(e) => updateResource(index, 'type', e.target.value as 'pdf' | 'image')}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeResourceFile(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section - Keep as is */}
      <div 
        ref={faqsRef} 
        id="faqs" 
        className="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowBulkFaqImport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              <Clipboard className="w-4 h-4" />
              Import JSON
            </button>
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add FAQ
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {formData.faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    rows={2}
                    placeholder="Answer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Course JSON Import Modal */}
      {showCourseJsonImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Import Complete Course JSON
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Existing FAQs are preserved. Imported FAQs are appended.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCourseJsonImport(false);
                  setCourseJsonError('');
                  setCourseJsonSuccess(false);
                  setCourseJsonInput('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close course JSON importer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Paste course JSON
                </label>
                <textarea
                  value={courseJsonInput}
                  onChange={(event) => {
                    setCourseJsonInput(event.target.value);
                    setCourseJsonError('');
                    setCourseJsonSuccess(false);
                  }}
                  rows={18}
                  placeholder='{"title":"Course title","cms":"<h2>HTML content</h2>"}'
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                  spellCheck={false}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-800">
                  Safe autofill behavior
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Text, prices, SEO, HTML content, lists, landing-page blocks,
                  curriculum, projects, testimonials, certificate and FAQs are
                  imported. Category, status, currency, level, banner and resource
                  files are skipped.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCourseJsonInput(exampleCourseJson);
                    setCourseJsonError('');
                    setCourseJsonSuccess(false);
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Load example JSON
                </button>
              </div>

              {courseJsonError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{courseJsonError}</p>
                </div>
              )}

              {courseJsonSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">
                    Course JSON imported successfully. Existing FAQs were kept.
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCourseJsonImport(false);
                    setCourseJsonError('');
                    setCourseJsonSuccess(false);
                    setCourseJsonInput('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCourseJsonImport}
                  disabled={!courseJsonInput.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Import Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk FAQ Import Modal - Keep as is */}
      {showBulkFaqImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Import FAQs from JSON</h3>
              <button
                type="button"
                onClick={() => {
                  setShowBulkFaqImport(false);
                  setBulkImportError('');
                  setBulkFaqInput('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Paste your FAQ JSON here
                </label>
                <textarea
                  value={bulkFaqInput}
                  onChange={(e) => {
                    setBulkFaqInput(e.target.value);
                    setBulkImportError('');
                    setBulkImportSuccess(false);
                  }}
                  rows={10}
                  placeholder={`[
  {
    "question": "What is this course about?",
    "answer": "This course covers..."
  },
  {
    "question": "Who is this course for?",
    "answer": "This course is designed for..."
  }
]`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-mono"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-800 mb-1">📋 Expected Format:</p>
                <p className="text-xs text-blue-700">Array of objects with "question" and "answer" fields</p>
                <button
                  type="button"
                  onClick={() => {
                    setBulkFaqInput(exampleFaqJson);
                    setBulkImportError('');
                    setBulkImportSuccess(false);
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Load example JSON
                </button>
              </div>

              {bulkImportError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{bulkImportError}</p>
                </div>
              )}

              {bulkImportSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">FAQs imported successfully!</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkFaqImport(false);
                    setBulkImportError('');
                    setBulkFaqInput('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkFaqImport}
                  disabled={!bulkFaqInput.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Import FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || categoriesLoading}
          className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Course' : 'Create Course'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
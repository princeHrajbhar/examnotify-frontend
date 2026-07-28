// components/blog/CategoryCard.tsx
import Link from 'next/link';
import { IBlogCategory } from '@/features/blogCategory/api/blogCategoryApi';

interface CategoryCardProps {
  category: IBlogCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Generate a gradient color based on category name
  const getGradientColor = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-red-500 to-pink-600',
      'from-yellow-500 to-orange-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-teal-500 to-cyan-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Generate icon based on category name
  const getIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      'AI': '🤖',
      'Technology': '💻',
      'Business': '📈',
      'Design': '🎨',
      'Marketing': '📊',
      'Development': '⚡',
      'Data': '📊',
      'Cloud': '☁️',
      'Security': '🔒',
      'DevOps': '🚀',
    };
    
    // Find matching icon (case insensitive)
    const key = Object.keys(icons).find(k => 
      name.toLowerCase().includes(k.toLowerCase())
    );
    return key ? icons[key] : '📁';
  };

  return (
    <Link 
      href={`/blog/category/${category.slug}`}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Gradient Background */}
        <div className={`bg-gradient-to-br ${getGradientColor(category.name)} p-6 h-48 flex flex-col justify-between`}>
          {/* Icon */}
          <div className="text-4xl mb-2">
            {getIcon(category.name)}
          </div>
          
          {/* Content */}
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:underline">
              {category.name}
            </h3>
            <p className="text-sm opacity-90">
              View articles →
            </p>
          </div>

          {/* Decorative circle */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white opacity-10"></div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
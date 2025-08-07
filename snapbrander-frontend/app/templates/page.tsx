
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: string;
  downloads: number;
  rating: number;
  tags: string[];
  featured: boolean;
  demo: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/templates/', {}, false);

      if (response.success) {
        const templatesData = response.data.templates.map((template: any) => ({
          id: template.id,
          name: template.name,
          category: template.category,
          description: template.description_ar || template.description,
          image: template.preview_image,
          price: template.price > 0 ? 'مدفوع' : 'مجاني',
          downloads: template.downloads_count,
          rating: template.rating,
          tags: template.tags ? JSON.parse(template.tags) : [],
          featured: template.is_featured,
          demo: template.demo_url
        }));
        setTemplates(templatesData);
      } else {
        setError('فشل في تحميل القوالب');
      }
    } catch (err) {
      setError('حدث خطأ في تحميل القوالب');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchApi('/api/templates/categories', {}, false);

      if (response.success) {
        const categoryNames: { [key: string]: string } = {
          'business': 'أعمال',
          'ecommerce': 'تجارة إلكترونية',
          'portfolio': 'معرض أعمال',
          'restaurant': 'مطعم',
          'blog': 'مدونة'
        };
        
        const categoriesData = [
          { id: 'all', name: 'الكل', count: templates.length }
        ];
        
        response.data.categories.forEach((cat: string) => {
          const count = templates.filter(t => t.category === cat).length;
          categoriesData.push({
            id: cat,
            name: categoryNames[cat] || cat,
            count: count
          });
        });
        
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templates.length > 0) {
      fetchCategories();
    }
  }, [templates]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <DashboardLayout title="مكتبة القوالب" currentPath="/templates">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">جاري تحميل القوالب...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="مكتبة القوالب" currentPath="/templates">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">حدث خطأ</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <button 
              onClick={fetchTemplates}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="مكتبة القوالب" currentPath="/templates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">مكتبة القوالب</h2>
            <p className="text-slate-400">اكتشف قوالب مذهلة لموقعك التالي</p>
          </div>
          <Link
            href="/templates/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            <span>إضافة قالب</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="البحث في القوالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
              >
                <option value="popular">الأكثر شعبية</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="name">الاسم</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Templates */}
        {selectedCategory === 'all' && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <i className="ri-star-line text-yellow-400"></i>
              القوالب المميزة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.filter(t => t.featured).map((template) => (
                <div key={template.id} className="bg-slate-700 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                  <div className="relative">
                    <img 
                      src={template.image}
                      alt={template.name}
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                      مميز
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        template.price === 'مجاني' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {template.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                    <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <i className="ri-star-fill text-sm"></i>
                        <span className="text-sm">{template.rating}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {template.downloads} تحميل
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors whitespace-nowrap">
                        معاينة
                      </button>
                      <button className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-3 rounded text-sm transition-colors whitespace-nowrap">
                        استخدام
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">
              جميع القوالب ({sortedTemplates.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map((template) => (
              <div key={template.id} className="bg-slate-700 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                <div className="relative">
                  <img 
                    src={template.image}
                    alt={template.name}
                    className="w-full h-40 object-cover object-top"
                  />
                  {template.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                      مميز
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      template.price === 'مجاني' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {template.price}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags && template.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <i className="ri-star-fill text-xs"></i>
                      <span className="text-xs">{template.rating}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {template.downloads} تحميل
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-2 rounded text-xs transition-colors whitespace-nowrap">
                      معاينة
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white py-1.5 px-2 rounded text-xs transition-colors whitespace-nowrap">
                      استخدام
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                <i className="ri-search-line text-2xl text-slate-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">لا توجد قوالب</h3>
              <p className="text-slate-400">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

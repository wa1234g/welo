
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateTemplate() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    price: 'free',
    demoUrl: '',
    downloadUrl: '',
    features: [] as string[]
  });

  const categories = [
    { id: 'business', name: 'أعمال', icon: 'ri-briefcase-line' },
    { id: 'ecommerce', name: 'تجارة إلكترونية', icon: 'ri-shopping-cart-line' },
    { id: 'portfolio', name: 'معرض أعمال', icon: 'ri-image-line' },
    { id: 'blog', name: 'مدونة', icon: 'ri-article-line' },
    { id: 'restaurant', name: 'مطعم', icon: 'ri-restaurant-line' },
    { id: 'medical', name: 'طبي', icon: 'ri-health-book-line' }
  ];

  const features = [
    { id: 'responsive', name: 'تصميم متجاوب', icon: 'ri-smartphone-line' },
    { id: 'seo', name: 'محسن للSEO', icon: 'ri-search-eye-line' },
    { id: 'fast', name: 'سرعة عالية', icon: 'ri-flashlight-line' },
    { id: 'customizable', name: 'قابل للتخصيص', icon: 'ri-palette-line' },
    { id: 'multipage', name: 'متعدد الصفحات', icon: 'ri-pages-line' },
    { id: 'contact', name: 'نماذج اتصال', icon: 'ri-mail-line' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إنشاء القالب بنجاح! سيتم مراجعته قبل النشر');
  };

  return (
    <DashboardLayout title="إضافة قالب جديد" currentPath="/templates/create">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} id="create-template-form" className="space-y-6">
          {/* Template Basic Info */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">معلومات القالب الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">اسم القالب</label>
                <input
                  type="text"
                  name="templateName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل اسم القالب"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">السعر</label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                  required
                >
                  <option value="free">مجاني</option>
                  <option value="paid">مدفوع</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">وصف القالب</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="اكتب وصفاً مفصلاً عن القالب (أقل من 500 حرف)"
                required
              />
              <div className="text-xs text-slate-400 mt-1">{formData.description.length}/500 حرف</div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">الكلمات المفتاحية</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">فئة القالب</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setFormData({...formData, category: category.id})}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.category === category.id 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      formData.category === category.id ? 'bg-purple-600' : 'bg-slate-600'
                    }`}>
                      <i className={`${category.icon} text-xl text-white`}></i>
                    </div>
                    <h4 className="font-medium text-white text-sm">{category.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">ميزات القالب</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => {
                    const newFeatures = formData.features.includes(feature.id)
                      ? formData.features.filter(f => f !== feature.id)
                      : [...formData.features, feature.id];
                    setFormData({...formData, features: newFeatures});
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.features.includes(feature.id)
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${feature.icon} text-lg ${
                      formData.features.includes(feature.id) ? 'text-purple-400' : 'text-slate-400'
                    }`}></i>
                    <span className="text-white text-sm">{feature.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Files */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">ملفات القالب</h3>
            <div className="space-y-6">
              {/* Preview Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">صورة المعاينة</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <i className="ri-image-line text-4xl text-slate-400 mb-4"></i>
                  <p className="text-slate-400 mb-2">اسحب وأفلت صورة المعاينة هنا أو</p>
                  <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                    تصفح الملفات
                  </button>
                  <p className="text-xs text-slate-500 mt-2">يفضل 800x600 بكسل</p>
                </div>
              </div>

              {/* Template Files */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ملفات القالب (ZIP)</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <i className="ri-file-zip-line text-4xl text-slate-400 mb-4"></i>
                  <p className="text-slate-400 mb-2">اسحب وأفلت ملف ZIP هنا أو</p>
                  <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                    تصفح الملفات
                  </button>
                  <p className="text-xs text-slate-500 mt-2">ملف ZIP يحتوي على جميع ملفات القالب</p>
                </div>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">روابط القالب</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رابط المعاينة المباشرة</label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="https://demo.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رابط التحميل (اختياري)</label>
                <input
                  type="url"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="https://download.example.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Link 
              href="/templates"
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <i className="ri-upload-line"></i>
              <span>رفع القالب</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

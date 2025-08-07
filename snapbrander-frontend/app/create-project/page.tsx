
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateProject() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    template: '',
    domain: '',
    hosting: 'snapbrander',
    features: []
  });

  const categories = [
    { id: 'business', name: 'أعمال', icon: 'ri-briefcase-line' },
    { id: 'ecommerce', name: 'تجارة إلكترونية', icon: 'ri-shopping-cart-line' },
    { id: 'portfolio', name: 'معرض أعمال', icon: 'ri-image-line' },
    { id: 'blog', name: 'مدونة', icon: 'ri-article-line' },
    { id: 'restaurant', name: 'مطعم', icon: 'ri-restaurant-line' },
    { id: 'medical', name: 'طبي', icon: 'ri-health-book-line' }
  ];

  const templates = [
    {
      id: 'minimal-pro',
      name: 'Minimal Pro',
      image: 'https://readdy.ai/api/search-image?query=minimal%20website%20template%20with%20clean%20design%2C%20white%20background%2C%20simple%20layout%2C%20modern%20typography%2C%20professional%20look&width=300&height=200&seq=minimal-pro&orientation=landscape',
      category: 'business'
    },
    {
      id: 'ecom-master',
      name: 'E-commerce Master',
      image: 'https://readdy.ai/api/search-image?query=ecommerce%20website%20template%20with%20product%20showcase%2C%20shopping%20interface%2C%20modern%20design%2C%20clean%20layout&width=300&height=200&seq=ecom-master&orientation=landscape',
      category: 'ecommerce'
    },
    {
      id: 'creative-hub',
      name: 'Creative Hub',
      image: 'https://readdy.ai/api/search-image?query=creative%20portfolio%20website%20template%20with%20artistic%20design%2C%20gallery%20layout%2C%20colorful%20elements%2C%20modern%20style&width=300&height=200&seq=creative-hub&orientation=landscape',
      category: 'portfolio'
    }
  ];

  const features = [
    { id: 'responsive', name: 'تصميم متجاوب', icon: 'ri-smartphone-line' },
    { id: 'seo', name: 'محسن للSEO', icon: 'ri-search-eye-line' },
    { id: 'ssl', name: 'شهادة SSL', icon: 'ri-shield-check-line' },
    { id: 'backup', name: 'نسخ احتياطية', icon: 'ri-cloud-line' },
    { id: 'analytics', name: 'تحليلات', icon: 'ri-bar-chart-line' },
    { id: 'maintenance', name: 'صيانة شهرية', icon: 'ri-tools-line' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم إنشاء المشروع بنجاح! سيتم إعادة توجيهك إلى صفحة المشروع');
  };

  return (
    <DashboardLayout title="إنشاء مشروع جديد" currentPath="/create-project">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} id="create-project-form" className="space-y-6">
          {/* Project Basic Info */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">معلومات المشروع الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">اسم المشروع</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل اسم المشروع"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">النطاق المفضل</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="myproject.snapbrander.com"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">وصف المشروع</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="اكتب وصفاً مختصراً عن مشروعك (أقل من 500 حرف)"
                required
              />
              <div className="text-xs text-slate-400 mt-1">{formData.description.length}/500 حرف</div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">فئة المشروع</h3>
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

          {/* Template Selection */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">اختيار القالب</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setFormData({...formData, template: template.id})}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all ${
                    formData.template === template.id 
                      ? 'ring-2 ring-purple-500' 
                      : 'hover:transform hover:scale-105'
                  }`}
                >
                  <img 
                    src={template.image}
                    alt={template.name}
                    className="w-full h-40 object-cover object-top"
                  />
                  <div className="p-4 bg-slate-700">
                    <h4 className="font-medium text-white text-sm">{template.name}</h4>
                    {formData.template === template.id && (
                      <div className="flex items-center gap-2 mt-2 text-purple-400">
                        <i className="ri-check-line"></i>
                        <span className="text-xs">محدد</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">الميزات المطلوبة</h3>
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

          {/* Hosting Options */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">خيارات الاستضافة</h3>
            <div className="space-y-4">
              <div 
                onClick={() => setFormData({...formData, hosting: 'snapbrander'})}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  formData.hosting === 'snapbrander' 
                    ? 'border-purple-500 bg-purple-500/20' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="ri-cloud-line text-xl text-purple-400"></i>
                  <div>
                    <h4 className="font-medium text-white">استضافة SnapBrander</h4>
                    <p className="text-sm text-slate-400">استضافة سريعة وآمنة على خوادمنا</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setFormData({...formData, hosting: 'custom'})}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  formData.hosting === 'custom' 
                    ? 'border-purple-500 bg-purple-500/20' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="ri-server-line text-xl text-blue-400"></i>
                  <div>
                    <h4 className="font-medium text-white">استضافة مخصصة</h4>
                    <p className="text-sm text-slate-400">ارفع على استضافتك الخاصة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <i className="ri-add-line"></i>
              <span>إنشاء المشروع</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

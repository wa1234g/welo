'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WebsiteGenerator() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessType: '',
    companyName: '',
    description: '',
    colors: { primary: '#6366f1', secondary: '#8b5cf6' },
    logo: null,
    features: [],
    template: '',
    services: []
  });

  const [currentService, setCurrentService] = useState({ name: '', description: '' });
  const [showServiceForm, setShowServiceForm] = useState(false);

  const businessTypes = [
    { id: 'restaurant', name: 'مطعم', icon: 'ri-restaurant-line' },
    { id: 'ecommerce', name: 'متجر إلكتروني', icon: 'ri-shopping-cart-line' },
    { id: 'portfolio', name: 'معرض أعمال', icon: 'ri-briefcase-line' },
    { id: 'blog', name: 'مدونة', icon: 'ri-article-line' },
    { id: 'corporate', name: 'شركة', icon: 'ri-building-line' },
    { id: 'medical', name: 'طبي', icon: 'ri-health-book-line' },
    { id: 'education', name: 'تعليمي', icon: 'ri-graduation-cap-line' },
    { id: 'nonprofit', name: 'غير ربحي', icon: 'ri-heart-line' }
  ];

  const features = [
    { id: 'contact', name: 'نموذج اتصال', icon: 'ri-mail-line' },
    { id: 'gallery', name: 'معرض الصور', icon: 'ri-gallery-line' },
    { id: 'booking', name: 'نظام حجز', icon: 'ri-calendar-line' },
    { id: 'ecommerce', name: 'متجر إلكتروني', icon: 'ri-shopping-bag-line' },
    { id: 'blog', name: 'مدونة', icon: 'ri-article-line' },
    { id: 'testimonials', name: 'آراء العملاء', icon: 'ri-star-line' },
    { id: 'social', name: 'وسائل التواصل', icon: 'ri-share-line' },
    { id: 'chat', name: 'دردشة مباشرة', icon: 'ri-message-line' }
  ];

  const templates = [
    {
      id: 'modern-business',
      name: 'الأعمال الحديثة',
      image: 'https://readdy.ai/api/search-image?query=modern%20business%20website%20template%20with%20clean%20professional%20design%2C%20corporate%20layout%2C%20blue%20and%20white%20color%20scheme%2C%20minimalist%20style%2C%20landing%20page&width=300&height=200&seq=template-modern&orientation=landscape',
      category: 'أعمال'
    },
    {
      id: 'creative-agency',
      name: 'الوكالة الإبداعية',
      image: 'https://readdy.ai/api/search-image?query=creative%20agency%20website%20template%20with%20colorful%20design%2C%20portfolio%20showcase%2C%20modern%20typography%2C%20artistic%20elements&width=300&height=200&seq=template-creative&orientation=landscape',
      category: 'إبداعي'
    },
    {
      id: 'ecommerce-store',
      name: 'المتجر الإلكتروني',
      image: 'https://readdy.ai/api/search-image?query=ecommerce%20website%20template%20with%20product%20grid%2C%20shopping%20cart%2C%20clean%20product%20showcase%2C%20modern%20interface&width=300&height=200&seq=template-ecommerce&orientation=landscape',
      category: 'تجارة إلكترونية'
    },
    {
      id: 'restaurant-menu',
      name: 'مطعم فاخر',
      image: 'https://readdy.ai/api/search-image?query=restaurant%20website%20template%20with%20elegant%20menu%20design%2C%20food%20photography%2C%20warm%20colors%2C%20dining%20atmosphere&width=300&height=200&seq=template-restaurant&orientation=landscape',
      category: 'مطاعم'
    },
    {
      id: 'medical-clinic',
      name: 'العيادة الطبية',
      image: 'https://readdy.ai/api/search-image?query=medical%20website%20template%20with%20healthcare%20design%2C%20professional%20medical%20interface%2C%20clean%20white%20layout%2C%20trust%20elements&width=300&height=200&seq=template-medical&orientation=landscape',
      category: 'طبي'
    },
    {
      id: 'education-center',
      name: 'المركز التعليمي',
      image: 'https://readdy.ai/api/search-image?query=education%20website%20template%20with%20learning%20platform%20design%2C%20course%20layout%2C%20academic%20style%2C%20student%20interface&width=300&height=200&seq=template-education&orientation=landscape',
      category: 'تعليمي'
    }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const addService = () => {
    if (currentService.name.trim() && currentService.description.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, { ...currentService, id: Date.now() }]
      });
      setCurrentService({ name: '', description: '' });
      setShowServiceForm(false);
    }
  };

  const removeService = (serviceId) => {
    setFormData({
      ...formData,
      services: formData.services.filter(service => service.id !== serviceId)
    });
  };

  const enhanceWithAI = async (text, type) => {
    // محاكاة تحسين المحتوى بالذكاء الاصطناعي
    const enhanced = `${text} - تم تحسينه بالذكاء الاصطناعي لجعله أكثر جاذبية واحترافية وملائماً لمحركات البحث`;
    
    if (type === 'description') {
      setFormData({ ...formData, description: enhanced });
    } else if (type === 'service') {
      setCurrentService({ ...currentService, description: enhanced });
    }
    
    alert('تم تحسين النص بالذكاء الاصطناعي بنجاح!');
  };

  const handleGenerate = () => {
    // التحقق من اكتمال البيانات
    if (!formData.businessType || !formData.companyName || !formData.description || 
        !formData.template || formData.features.length === 0) {
      alert('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }
    
    // الانتقال إلى صفحة التقدم
    router.push('/website-progress');
  };

  return (
    <DashboardLayout title="مولد المواقع التلقائي" currentPath="/website-generator">
      <div className="max-w-4xl mx-auto font-cairo">
        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">إنشاء موقع جديد</h2>
            <span className="text-sm text-slate-400">الخطوة {step} من 5</span>
          </div>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  num <= step ? 'bg-purple-600 text-white' : 'bg-slate-600 text-slate-400'
                }`}>
                  {num}
                </div>
                {num < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    num < step ? 'bg-purple-600' : 'bg-slate-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>نوع النشاط</span>
            <span>معلومات الشركة</span>
            <span>الخدمات</span>
            <span>الميزات والألوان</span>
            <span>اختيار القالب</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 rounded-xl p-6">
          {/* Step 1: Business Type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">ما نوع نشاطك التجاري؟</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {businessTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setFormData({...formData, businessType: type.id})}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:transform hover:scale-105 ${
                      formData.businessType === type.id 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        formData.businessType === type.id ? 'bg-purple-600' : 'bg-slate-600'
                      }`}>
                        <i className={`${type.icon} text-2xl text-white`}></i>
                      </div>
                      <h4 className="font-medium text-white text-sm">{type.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Company Info */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">معلومات شركتك</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">اسم الشركة</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أدخل اسم شركتك"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">وصف النشاط</label>
                    <button
                      type="button"
                      onClick={() => enhanceWithAI(formData.description, 'description')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:from-purple-700 hover:to-blue-700 transition-all whitespace-nowrap"
                    >
                      <i className="ri-magic-line"></i>
                      <span>تحسين بالذكاء الاصطناعي</span>
                    </button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="اكتب وصفاً مختصراً عن نشاطك التجاري (أقل من 500 حرف)"
                  />
                  <div className="text-xs text-slate-400 mt-1">{formData.description.length}/500 حرف</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">شعار الشركة (اختياري)</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors">
                    <i className="ri-upload-cloud-line text-4xl text-slate-400 mb-4"></i>
                    <p className="text-slate-400 mb-2">اسحب وأفلت الشعار هنا أو</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                      تصفح الملفات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">خدمات شركتك</h3>
              <div className="space-y-6">
                {/* Add Service Button */}
                <div className="flex justify-between items-center">
                  <p className="text-slate-400">أضف الخدمات التي تقدمها شركتك</p>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-add-line"></i>
                    <span>إضافة خدمة</span>
                  </button>
                </div>

                {/* Service Form Modal */}
                {showServiceForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                      <h4 className="text-lg font-semibold text-white mb-4">إضافة خدمة جديدة</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">اسم الخدمة</label>
                          <input
                            type="text"
                            value={currentService.name}
                            onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="مثل: تصميم المواقع"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-300">وصف الخدمة</label>
                            <button
                              type="button"
                              onClick={() => enhanceWithAI(currentService.description, 'service')}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 hover:from-purple-700 hover:to-blue-700 transition-all whitespace-nowrap"
                            >
                              <i className="ri-magic-line"></i>
                              <span>تحسين</span>
                            </button>
                          </div>
                          <textarea
                            value={currentService.description}
                            onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="اكتب وصفاً للخدمة..."
                          />
                          <div className="text-xs text-slate-400 mt-1">{currentService.description.length}/500 حرف</div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setShowServiceForm(false)}
                          className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors whitespace-nowrap"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={addService}
                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
                        >
                          إضافة الخدمة
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Services List */}
                <div className="space-y-3">
                  {formData.services.map((service) => (
                    <div key={service.id} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white mb-2">{service.name}</h5>
                          <p className="text-slate-400 text-sm">{service.description}</p>
                        </div>
                        <button
                          onClick={() => removeService(service.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.services.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <i className="ri-service-line text-4xl mb-2"></i>
                      <p>لم تتم إضافة أي خدمات بعد</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Features and Colors */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">الميزات والألوان</h3>
              <div className="space-y-8">
                {/* Features */}
                <div>
                  <h4 className="font-medium text-white mb-4">اختر الميزات المطلوبة:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature) => (
                      <div
                        key={feature.id}
                        onClick={() => {
                          const newFeatures = formData.features.includes(feature.id)
                            ? formData.features.filter(f => f !== feature.id)
                            : [...formData.features, feature.id];
                          setFormData({...formData, features: newFeatures});
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:transform hover:scale-105 ${
                          formData.features.includes(feature.id)
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-center">
                          <i className={`${feature.icon} text-2xl mb-2 ${
                            formData.features.includes(feature.id) ? 'text-purple-400' : 'text-slate-400'
                          }`}></i>
                          <div className="text-white text-sm font-medium">{feature.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium text-white mb-4">ألوان الموقع:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">اللون الأساسي</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData({
                            ...formData, 
                            colors: {...formData.colors, primary: e.target.value}
                          })}
                          className="w-12 h-12 rounded-lg border border-slate-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData({
                            ...formData, 
                            colors: {...formData.colors, primary: e.target.value}
                          })}
                          className="flex-1 px-3 py-2 bg-slate-700 text-white rounded text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">اللون الثانوي</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData({
                            ...formData, 
                            colors: {...formData.colors, secondary: e.target.value}
                          })}
                          className="w-12 h-12 rounded-lg border border-slate-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData({
                            ...formData, 
                            colors: {...formData.colors, secondary: e.target.value}
                          })}
                          className="flex-1 px-3 py-2 bg-slate-700 text-white rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Template Selection */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">اختر القالب المناسب</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setFormData({...formData, template: template.id})}
                    className={`rounded-xl overflow-hidden cursor-pointer transition-all hover:transform hover:scale-105 ${
                      formData.template === template.id 
                        ? 'ring-2 ring-purple-500 transform scale-105' 
                        : 'hover:transform hover:scale-102'
                    }`}
                  >
                    <img 
                      src={template.image}
                      alt={template.name}
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="p-4 bg-slate-700">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <p className="text-sm text-slate-400">{template.category}</p>
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
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-600">
            <div>
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-arrow-right-line"></i>
                  <span>السابق</span>
                </button>
              )}
            </div>
            <div>
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.businessType) ||
                    (step === 2 && (!formData.companyName || !formData.description)) ||
                    (step === 3 && formData.services.length === 0) ||
                    (step === 4 && formData.features.length === 0)
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <span>التالي</span>
                  <i className="ri-arrow-left-line"></i>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!formData.template}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-magic-line"></i>
                  <span>إنشاء الموقع الآن</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
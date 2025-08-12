'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    company: 'شركة التقنية المتقدمة',
    position: 'مدير المشاريع',
    bio: 'خبير في تطوير المواقع والتجارة الإلكترونية منذ أكثر من 8 سنوات',
    location: 'الرياض، المملكة العربية السعودية',
    website: 'https://ahmed-portfolio.com',
    avatar: null,
    notifications: {
      email: true,
      push: false,
      marketing: true
    },
    privacy: {
      showProfile: true,
      showProjects: false,
      showStats: true
    },
    language: 'ar',
    timezone: 'Asia/Riyadh'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\+966[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'صيغة رقم الهاتف غير صحيحة (يجب أن يبدأ بـ +966)';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'النبذة يجب أن تكون أقل من 500 حرف';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'رابط الموقع يجب أن يبدأ بـ http:// أو https://';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/profile');
      }, 2000);
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ البيانات' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [parent]: { ...(formData as any)[parent], [field]: value }
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 font-cairo flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-2xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">تم الحفظ بنجاح!</h2>
            <p className="text-slate-400 mb-6">
              تم تحديث معلومات الملف الشخصي بنجاح
            </p>
            <div className="space-y-3">
              <Link
                href="/profile"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                العودة إلى الملف الشخصي
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="تعديل الملف الشخصي" currentPath="/profile/edit">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">تعديل الملف الشخصي</h1>
            <p className="text-slate-400">قم بتحديث معلوماتك الشخصية وإعدادات الحساب</p>
          </div>
          <Link
            href="/profile"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="ri-arrow-right-line text-xl"></i>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" id="edit-profile-form">
          {/* Personal Information */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">المعلومات الشخصية</h2>
            
            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">الصورة الشخصية</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    formData.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      <i className="ri-upload-line ml-1"></i>
                      رفع صورة
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                      >
                        <i className="ri-delete-bin-line ml-1"></i>
                        حذف
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    أحجام مقبولة: JPG, PNG. حد أقصى 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل البريد الإلكتروني"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="+966501234567"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل اسم الشركة"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  المنصب
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل منصبك"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل موقعك"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                نبذة شخصية
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="اكتب نبذة عنك..."
              />
              <div className="text-xs text-slate-400 mt-1 flex justify-between">
                <span>{formData.bio.length}/500 حرف</span>
                {errors.bio && <span className="text-red-400">{errors.bio}</span>}
              </div>
            </div>

            {/* Website */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                الموقع الشخصي
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-400 text-sm mt-1">{errors.website}</p>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">تفضيلات الإشعارات</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">إشعارات البريد الإلكتروني</div>
                  <div className="text-sm text-slate-400">تلقي الإشعارات المهمة عبر البريد</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">الإشعارات المنبثقة</div>
                  <div className="text-sm text-slate-400">إشعارات فورية في المتصفح</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">الإشعارات التسويقية</div>
                  <div className="text-sm text-slate-400">العروض والأخبار والتحديثات</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.marketing}
                    onChange={(e) => handleNestedChange('notifications', 'marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">إعدادات الخصوصية</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">إظهار الملف الشخصي</div>
                  <div className="text-sm text-slate-400">السماح للآخرين برؤية ملفك الشخصي</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy.showProfile}
                    onChange={(e) => handleNestedChange('privacy', 'showProfile', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">إظهار المشاريع</div>
                  <div className="text-sm text-slate-400">عرض مشاريعك في ملفك الشخصي</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy.showProjects}
                    onChange={(e) => handleNestedChange('privacy', 'showProjects', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">إظهار الإحصائيات</div>
                  <div className="text-sm text-slate-400">عرض إحصائيات أنشطتك</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacy.showStats}
                    onChange={(e) => handleNestedChange('privacy', 'showStats', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">تفضيلات النظام</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  اللغة
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  المنطقة الزمنية
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                >
                  <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                  <option value="Asia/Dubai">دبي (UTC+4)</option>
                  <option value="Africa/Cairo">القاهرة (UTC+2)</option>
                  <option value="Europe/London">لندن (UTC+0)</option>
                  <option value="America/New_York">نيويورك (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <i className="ri-error-warning-line"></i>
                <span>{errors.general}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link
              href="/profile"
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-colors text-center whitespace-nowrap"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

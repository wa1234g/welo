
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const project = {
    id: params.id,
    name: 'موقع شركتي',
    domain: 'mycompany.fureraa.com',
    url: 'https://mycompany.fureraa.com'
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
    if (!/(?=.*[a-z])/.test(password)) errors.push('يجب أن تحتوي على حرف صغير');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('يجب أن تحتوي على حرف كبير');
    if (!/(?=.*\d)/.test(password)) errors.push('يجب أن تحتوي على رقم');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('يجب أن تحتوي على رمز خاص');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // التحقق من صحة البيانات
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      newErrors.newPassword = passwordErrors;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // محاكاة تغيير كلمة المرور
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        router.push('/client-dashboard');
      }, 3000);
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء تغيير كلمة المرور' });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    let password = '';
    
    // ضمان وجود كل نوع من الأحرف
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '@$!%*?&'[Math.floor(Math.random() * 7)];
    
    for (let i = 4; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // خلط الأحرف
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setFormData({
      ...formData,
      newPassword: newPassword,
      confirmPassword: newPassword
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
            <h2 className="text-2xl font-bold text-white mb-4">تم تغيير كلمة المرور بنجاح!</h2>
            <p className="text-slate-400 mb-6">
              تم تحديث كلمة مرور موقع "{project.name}" بنجاح. يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
            </p>
            <div className="space-y-3">
              <Link
                href="/client-dashboard"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                العودة إلى لوحة التحكم
              </Link>
              <button
                onClick={() => window.open(project.url + '/wp-admin', '_blank')}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                تسجيل الدخول إلى الموقع
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-cairo">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/client-dashboard">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-white">SnapBrander</h1>
            </div>
            <Link
              href="/client-dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <i className="ri-arrow-right-line text-xl"></i>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-key-line text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تغيير كلمة المرور</h2>
          <p className="text-slate-400">
            تغيير كلمة مرور موقع: <span className="text-white font-medium">{project.name}</span>
          </p>
          <p className="text-slate-500 text-sm mt-1">{project.domain}</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-xl p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <i className="ri-error-warning-line"></i>
                <span>{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="أدخل كلمة المرور الحالية"
              />
              {errors.currentPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  كلمة المرور الجديدة
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors whitespace-nowrap"
                >
                  <i className="ri-refresh-line ml-1"></i>
                  توليد كلمة مرور قوية
                </button>
              </div>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="أدخل كلمة المرور الجديدة"
              />
              {errors.newPassword && (
                <div className="mt-1">
                  {Array.isArray(errors.newPassword) ? (
                    errors.newPassword.map((error, index) => (
                      <p key={index} className="text-red-400 text-sm">• {error}</p>
                    ))
                  ) : (
                    <p className="text-red-400 text-sm">{errors.newPassword}</p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="أعد كتابة كلمة المرور الجديدة"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">متطلبات كلمة المرور:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <i className={`ri-${formData.newPassword.length >= 8 ? 'check' : 'close'}-line text-${formData.newPassword.length >= 8 ? 'green' : 'red'}-400`}></i>
                  8 أحرف على الأقل
                </li>
                <li className="flex items-center gap-2">
                  <i className={`ri-${/(?=.*[a-z])/.test(formData.newPassword) ? 'check' : 'close'}-line text-${/(?=.*[a-z])/.test(formData.newPassword) ? 'green' : 'red'}-400`}></i>
                  حرف صغير واحد على الأقل
                </li>
                <li className="flex items-center gap-2">
                  <i className={`ri-${/(?=.*[A-Z])/.test(formData.newPassword) ? 'check' : 'close'}-line text-${/(?=.*[A-Z])/.test(formData.newPassword) ? 'green' : 'red'}-400`}></i>
                  حرف كبير واحد على الأقل
                </li>
                <li className="flex items-center gap-2">
                  <i className={`ri-${/(?=.*\d)/.test(formData.newPassword) ? 'check' : 'close'}-line text-${/(?=.*\d)/.test(formData.newPassword) ? 'green' : 'red'}-400`}></i>
                  رقم واحد على الأقل
                </li>
                <li className="flex items-center gap-2">
                  <i className={`ri-${/(?=.*[@$!%*?&])/.test(formData.newPassword) ? 'check' : 'close'}-line text-${/(?=.*[@$!%*?&])/.test(formData.newPassword) ? 'green' : 'red'}-400`}></i>
                  رمز خاص واحد على الأقل (@$!%*?&)
                </li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/client-dashboard"
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-colors text-center whitespace-nowrap"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <i className="ri-key-line"></i>
                    تغيير كلمة المرور
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Warning Notice */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-warning-line text-yellow-400 text-lg mt-0.5"></i>
            <div>
              <h4 className="font-medium text-yellow-400 mb-1">تنبيه مهم</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• سيتم تسجيل خروجك من جميع الجلسات النشطة</li>
                <li>• تأكد من حفظ كلمة المرور الجديدة في مكان آمن</li>
                <li>• قد تحتاج إلى إعادة تسجيل الدخول إلى التطبيقات المتصلة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

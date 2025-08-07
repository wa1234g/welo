
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebsiteProgress() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const steps = [
    { id: 1, title: 'تحليل المتطلبات', description: 'جاري تحليل بيانات مشروعك...', duration: 2000 },
    { id: 2, title: 'اختيار القالب', description: 'جاري تطبيق القالب المناسب...', duration: 3000 },
    { id: 3, title: 'توليد المحتوى', description: 'الذكاء الاصطناعي ينشئ المحتوى...', duration: 4000 },
    { id: 4, title: 'إضافة الخدمات', description: 'جاري إضافة الخدمات المطلوبة...', duration: 2500 },
    { id: 5, title: 'تخصيص التصميم', description: 'تطبيق الألوان والتصميم...', duration: 3000 },
    { id: 6, title: 'إعداد الموقع', description: 'جاري إعداد إعدادات WordPress...', duration: 2000 },
    { id: 7, title: 'النشر', description: 'جاري رفع الموقع على الخادم...', duration: 3500 },
    { id: 8, title: 'الاختبار النهائي', description: 'فحص الموقع والتأكد من عمله...', duration: 2000 }
  ];

  const createdWebsite = {
    name: 'موقع شركة التقنية المتقدمة',
    url: 'https://tech-company.fureraa.com',
    adminUrl: 'https://tech-company.fureraa.com/wp-admin',
    username: 'admin',
    password: 'SecurePass123!',
    domain: 'tech-company.fureraa.com',
    template: 'Business Pro',
    features: ['صفحة رئيسية', 'من نحن', 'خدماتنا', 'اتصل بنا', 'نموذج التواصل'],
    createdAt: new Date().toLocaleString('ar-SA')
  };

  useEffect(() => {
    if (currentStep <= steps.length && !isComplete) {
      const currentStepData = steps[currentStep - 1];
      const timer = setTimeout(() => {
        setProgress(prev => {
          const newProgress = (currentStep / steps.length) * 100;
          if (newProgress >= 100) {
            setIsComplete(true);
          }
          return newProgress;
        });

        if (currentStep < steps.length) {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length, isComplete]);

  const handleViewWebsite = () => {
    window.open(createdWebsite.url, '_blank');
  };

  const handleGoToDashboard = () => {
    router.push('/client-dashboard');
  };

  const handleLoginToAdmin = () => {
    window.open(createdWebsite.adminUrl, '_blank');
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-900 font-cairo flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <i className="ri-check-line text-4xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">تم إنشاء موقعك بنجاح! </h1>
            <p className="text-slate-400 text-lg">موقعك الآن جاهز ومنشور على الإنترنت</p>
          </div>

          {/* Website Preview Card */}
          <div className="bg-slate-800 rounded-xl p-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Website Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{createdWebsite.name}</h2>
                  <p className="text-slate-400 flex items-center gap-2">
                    <i className="ri-global-line"></i>
                    {createdWebsite.domain}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">معلومات تسجيل الدخول</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">رابط الإدارة:</span>
                        <span className="text-blue-400">{createdWebsite.adminUrl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">اسم المستخدم:</span>
                        <span className="text-white font-mono">{createdWebsite.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">كلمة المرور:</span>
                        <span className="text-white font-mono">{createdWebsite.password}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">تفاصيل الموقع</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">القالب:</span>
                        <span className="text-white">{createdWebsite.template}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">تاريخ الإنشاء:</span>
                        <span className="text-white">{createdWebsite.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">عدد الصفحات:</span>
                        <span className="text-white">{createdWebsite.features.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Preview */}
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">الصفحات المُنشأة</h3>
                  <div className="space-y-2">
                    {createdWebsite.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <i className="ri-check-line text-green-400"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white text-center">
                  <i className="ri-rocket-line text-3xl mb-3"></i>
                  <h3 className="font-bold mb-2">موقعك جاهز!</h3>
                  <p className="text-sm text-purple-100">يمكنك الآن زيارة موقعك أو إدارته من لوحة التحكم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewWebsite}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-3 font-semibold text-lg transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <i className="ri-eye-line"></i>
              <span>مشاهدة الموقع</span>
            </button>
            <button
              onClick={handleLoginToAdmin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-3 font-semibold text-lg transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <i className="ri-settings-line"></i>
              <span>لوحة التحكم</span>
            </button>
            <button
              onClick={handleGoToDashboard}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-3 font-semibold text-lg transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <i className="ri-dashboard-line"></i>
              <span>مشاريعي</span>
            </button>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-yellow-400 text-xl mt-0.5"></i>
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">ملاحظات مهمة</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• احفظ معلومات تسجيل الدخول في مكان آمن</li>
                  <li>• يمكنك تغيير كلمة المرور من لوحة تحكم WordPress</li>
                  <li>• تم إرسال تفاصيل الموقع إلى بريدك الإلكتروني</li>
                  <li>• يمكنك إدارة موقعك من لوحة التحكم الخاصة بك</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-cairo flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <i className="ri-magic-line text-3xl text-white loading-spin"></i>
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">جاري إنشاء موقعك...</h1>
          <p className="text-slate-400">الذكاء الاصطناعي ينشئ موقعك المخصص الآن</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-xl p-8 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">التقدم الإجمالي</span>
              <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center">
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentStep}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {steps[currentStep - 1]?.title}
                </h3>
              </div>
              <p className="text-slate-400">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="mt-8">
            <h4 className="text-white font-semibold mb-4 text-center">مراحل الإنشاء</h4>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500/20 border border-green-500/30'
                      : currentStep === step.id
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-slate-700/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-600 text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <i className="ri-check-line"></i>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        currentStep >= step.id ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </div>
                    {currentStep === step.id && (
                      <div className="text-sm text-slate-400 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                  {currentStep === step.id && (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <i className="ri-lightbulb-line text-yellow-400"></i>
            نصائح أثناء الانتظار
          </h4>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
              <span>يستغرق إنشاء الموقع عادة من 2-5 دقائق حسب تعقيد المتطلبات</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
              <span>سيتم إرسال تفاصيل الموقع ومعلومات تسجيل الدخول إلى بريدك الإلكتروني</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
              <span>يمكنك تخصيص موقعك لاحقاً من خلال لوحة تحكم WordPress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

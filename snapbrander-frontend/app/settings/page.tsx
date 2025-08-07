
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'SnapBrander',
    siteDescription: 'منصة ذكية لإنشاء مواقع WordPress تلقائياً',
    adminEmail: 'admin@fureraa.com',
    language: 'ar',
    timezone: 'Asia/Riyadh',
    registrationEnabled: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxProjects: 10,
    maxStorage: 1000,
    backupFrequency: 'daily',
    smtpServer: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    openaiApiKey: '',
    openrouterApiKey: '',
    selectedAiProvider: 'openai',
    hostingerApiKey: '',
    hostingerApiUrl: 'https://api.hostinger.com/v1',
    stripePublicKey: '',
    stripeSecretKey: '',
    paymobApiKey: '',
    paymobSecretKey: '',
    paymobMerchantId: '',
    installmentsEnabled: true,
    installmentPlans: [3, 6, 9, 12]
  });

  const tabs = [
    { id: 'general', label: 'عام', icon: 'ri-settings-line' },
    { id: 'email', label: 'البريد الإلكتروني', icon: 'ri-mail-line' },
    { id: 'limits', label: 'الحدود والقيود', icon: 'ri-shield-line' },
    { id: 'backup', label: 'النسخ الاحتياطية', icon: 'ri-cloud-line' },
    { id: 'integrations', label: 'التكاملات', icon: 'ri-plug-line' },
    { id: 'security', label: 'الأمان', icon: 'ri-lock-line' }
  ];

  const handleSave = () => {
    alert('تم حفظ الإعدادات بنجاح!');
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      alert('تم إعادة تعيين الإعدادات!');
    }
  };

  return (
    <DashboardLayout title="الإعدادات" currentPath="/settings">
      <div className="space-y-6">
        {/* Settings Header */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">إعدادات النظام</h2>
          <p className="text-slate-400">تخصيص وضبط إعدادات المنصة</p>
        </div>

        {/* Settings Navigation */}
        <div className="bg-slate-800 rounded-xl">
          <div className="border-b border-slate-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">الإعدادات العامة</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اسم الموقع</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني للمدير</label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">وصف الموقع</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <div className="text-xs text-slate-400 mt-1">{settings.siteDescription.length}/500 حرف</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اللغة</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">المنطقة الزمنية</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                    >
                      <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                      <option value="Asia/Dubai">دبي (GMT+4)</option>
                      <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.registrationEnabled}
                      onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <span className="text-slate-300">تمكين التسجيل الجديد</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <span className="text-slate-300">تمكين إشعارات البريد الإلكتروني</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <span className="text-slate-300">وضع الصيانة</span>
                  </label>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">إعدادات البريد الإلكتروني</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">خادم SMTP</label>
                    <input
                      type="text"
                      value={settings.smtpServer}
                      onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">منفذ SMTP</label>
                    <input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اسم المستخدم</label>
                    <input
                      type="text"
                      value={settings.smtpUsername}
                      onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      اختبار الاتصال
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      إرسال بريد تجريبي
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Limits Settings */}
            {activeTab === 'limits' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">الحدود والقيود</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">الحد الأقصى للمشاريع لكل مستخدم</label>
                    <input
                      type="number"
                      value={settings.maxProjects}
                      onChange={(e) => setSettings({ ...settings, maxProjects: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">الحد الأقصى للتخزين (MB)</label>
                    <input
                      type="number"
                      value={settings.maxStorage}
                      onChange={(e) => setSettings({ ...settings, maxStorage: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      min="100"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-3">قيود رفع الملفات</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">حجم الملف الأقصى (MB)</label>
                      <input
                        type="number"
                        defaultValue={50}
                        className="w-full px-3 py-2 bg-slate-600 text-white rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">أنواع الملفات المسموحة</label>
                      <input
                        type="text"
                        defaultValue="jpg,png,gif,zip,pdf"
                        className="w-full px-3 py-2 bg-slate-600 text-white rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">عدد الملفات الأقصى</label>
                      <input
                        type="number"
                        defaultValue={10}
                        className="w-full px-3 py-2 bg-slate-600 text-white rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">إعدادات النسخ الاحتياطية</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">تكرار النسخ الاحتياطية</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                  >
                    <option value="hourly">كل ساعة</option>
                    <option value="daily">يومياً</option>
                    <option value="weekly">أسبوعياً</option>
                    <option value="monthly">شهرياً</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">آخر نسخة احتياطية</h4>
                    <p className="text-slate-400 text-sm">2024-01-25 14:30</p>
                    <p className="text-green-400 text-sm">مكتملة بنجاح</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">حجم النسخ المخزنة</h4>
                    <p className="text-slate-400 text-sm">2.4 GB</p>
                    <p className="text-slate-400 text-sm">12 نسخة متاحة</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                    إنشاء نسخة احتياطية الآن
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                    عرض النسخ المحفوظة
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                    استعادة نسخة
                  </button>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">التكاملات الخارجية</h3>

                <div className="space-y-6">
                  {/* Hostinger API */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <i className="ri-server-line text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Hostinger API</h4>
                        <p className="text-slate-400 text-sm">لإدارة النطاقات والاستضافة</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">مفتاح API</label>
                        <input
                          type="password"
                          value={settings.hostingerApiKey}
                          onChange={(e) => setSettings({ ...settings, hostingerApiKey: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          placeholder="hpanel_api_..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">رابط API</label>
                        <input
                          type="text"
                          value={settings.hostingerApiUrl}
                          onChange={(e) => setSettings({ ...settings, hostingerApiUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          placeholder="https://api.hostinger.com/v1"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          اختبار الاتصال
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          عرض الوثائق
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Providers */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <i className="ri-brain-line text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">مزودي الذكاء الاصطناعي</h4>
                        <p className="text-slate-400 text-sm">اختر وأدر مزودي خدمات الذكاء الاصطناعي</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">المزود النشط</label>
                        <select
                          value={settings.selectedAiProvider}
                          onChange={(e) => setSettings({ ...settings, selectedAiProvider: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                        >
                          <option value="openai">OpenAI</option>
                          <option value="openrouter">OpenRouter</option>
                        </select>
                      </div>

                      {/* OpenAI Settings */}
                      <div className={`space-y-3 ${settings.selectedAiProvider !== 'openai' ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-2">
                          <i className="ri-openai-line text-green-400"></i>
                          <span className="font-medium text-white">OpenAI API</span>
                        </div>
                        <input
                          type="password"
                          value={settings.openaiApiKey}
                          onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          placeholder="sk-..."
                          disabled={settings.selectedAiProvider !== 'openai'}
                        />
                      </div>

                      {/* OpenRouter Settings */}
                      <div className={`space-y-3 ${settings.selectedAiProvider !== 'openrouter' ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-2">
                          <i className="ri-route-line text-blue-400"></i>
                          <span className="font-medium text-white">OpenRouter API</span>
                        </div>
                        <input
                          type="password"
                          value={settings.openrouterApiKey}
                          onChange={(e) => setSettings({ ...settings, openrouterApiKey: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          placeholder="sk-or-..."
                          disabled={settings.selectedAiProvider !== 'openrouter'}
                        />
                        <div className="text-xs text-slate-400">
                          يوفر الوصول لنماذج متعددة: GPT-4, Claude, Gemini وأكثر
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          اختبار المزود
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          تفعيل التكامل
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Paymob Payment Gateway */}
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <i className="ri-bank-card-2-line text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Paymob Egypt</h4>
                        <p className="text-slate-400 text-sm">بوابة الدفع المصرية مع دعم التقسيط</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">مفتاح API</label>
                          <input
                            type="password"
                            value={settings.paymobApiKey}
                            onChange={(e) => setSettings({ ...settings, paymobApiKey: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="ZXlKaGJHY2lPaU..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">المفتاح السري</label>
                          <input
                            type="password"
                            value={settings.paymobSecretKey}
                            onChange={(e) => setSettings({ ...settings, paymobSecretKey: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="HMAC Secret Key"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">معرف التاجر</label>
                        <input
                          type="text"
                          value={settings.paymobMerchantId}
                          onChange={(e) => setSettings({ ...settings, paymobMerchantId: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          placeholder="Merchant ID"
                        />
                      </div>

                      {/* Installment Settings */}
                      <div className="border-t border-slate-600 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-white">إعدادات التقسيط</h5>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.installmentsEnabled}
                              onChange={(e) => setSettings({ ...settings, installmentsEnabled: e.target.checked })}
                              className="w-4 h-4 text-green-600 bg-slate-600 border-slate-500 rounded focus:ring-green-500"
                            />
                            <span className="text-slate-300 text-sm">تفعيل التقسيط</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[3, 6, 9, 12, 18, 24].map((months) => (
                            <label key={months} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={settings.installmentPlans.includes(months)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSettings({
                                      ...settings,
                                      installmentPlans: [...settings.installmentPlans, months]
                                    });
                                  } else {
                                    setSettings({
                                      ...settings,
                                      installmentPlans: settings.installmentPlans.filter(m => m !== months)
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-green-600 bg-slate-600 border-slate-500 rounded focus:ring-green-500"
                                disabled={!settings.installmentsEnabled}
                              />
                              <span className={`text-sm ${settings.installmentsEnabled ? 'text-slate-300' : 'text-slate-500'}`}>
                                {months} شهر
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          اختبار الاتصال
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          عرض وثائق Paymob
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                          إدارة التقسيط
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">إعدادات الأمان</h3>

                <div className="space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">إعدادات كلمات المرور</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">الحد الأدنى لطول كلمة المرور</label>
                        <input
                          type="number"
                          defaultValue={8}
                          className="w-full px-3 py-2 bg-slate-600 text-white rounded text-sm"
                          min="6"
                          max="20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">انتهاء صلاحية كلمة المرور (أيام)</label>
                        <input
                          type="number"
                          defaultValue={90}
                          className="w-full px-3 py-2 bg-slate-600 text-white rounded text-sm"
                          min="30"
                          max="365"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">إعدادات تسجيل الدخول</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-slate-300 text-sm">تمكين المصادقة الثنائية</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-slate-300 text-sm">قفل الحساب بعد محاولات فاشلة</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-slate-300 text-sm">تسجيل جميع محاولات تسجيل الدخول</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">إجراءات الأمان</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm whitespace-nowrap">
                        إنهاء جميع الجلسات
                      </button>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm whitespace-nowrap">
                        مسح سجل الأمان
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm whitespace-nowrap">
                        تحديث مفاتيح التشفير
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-refresh-line"></i>
            <span>إعادة تعيين</span>
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-save-line"></i>
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

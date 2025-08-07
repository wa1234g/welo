'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function Domains() {
  const [activeTab, setActiveTab] = useState('search');
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const myDomains = [
    {
      id: 1,
      domain: 'mycompany.com',
      status: 'active',
      expiresAt: '2025-01-15',
      registrar: 'Hostinger',
      connectedProject: 'موقع الشركة الرئيسي',
      autoRenew: true,
      price: 120
    },
    {
      id: 2,
      domain: 'techblog.net',
      status: 'pending',
      expiresAt: '2024-12-30',
      registrar: 'Hostinger',
      connectedProject: null,
      autoRenew: false,
      price: 95
    }
  ];

  const handleDomainSearch = async () => {
    if (!domainSearch.trim()) return;
    
    setIsSearching(true);
    // محاكاة البحث عبر Hostinger API
    setTimeout(() => {
      const extensions = ['.com', '.net', '.org', '.sa', '.ae', '.eg'];
      const results = extensions.map(ext => ({
        domain: `${domainSearch}${ext}`,
        available: Math.random() > 0.4,
        price: Math.floor(Math.random() * 100) + 50,
        premium: Math.random() > 0.8
      }));
      setSearchResults(results);
      setIsSearching(false);
    }, 2000);
  };

  const handleDomainPurchase = (domain) => {
    alert(`سيتم تحويلك لصفحة الدفع لحجز النطاق: ${domain}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'pending': return 'قيد المعالجة';
      case 'expired': return 'منتهي الصلاحية';
      default: return 'غير معروف';
    }
  };

  return (
    <DashboardLayout title="إدارة النطاقات" currentPath="/domains">
      <div className="space-y-6 font-cairo">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">إدارة النطاقات المخصصة</h2>
              <p className="text-blue-100">ابحث واحجز وأدر نطاقاتك المخصصة</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">النطاقات المملوكة</div>
              <div className="text-2xl font-bold">{myDomains.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-slate-800 rounded-xl">
          <div className="border-b border-slate-700">
            <div className="flex">
              {[
                { id: 'search', label: 'البحث عن نطاق', icon: 'ri-search-line' },
                { id: 'my-domains', label: 'نطاقاتي', icon: 'ri-global-line' },
                { id: 'connect', label: 'ربط النطاقات', icon: 'ri-links-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
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
            {/* Domain Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">ابحث عن النطاق المثالي</h3>
                  <div className="flex gap-3 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={domainSearch}
                        onChange={(e) => setDomainSearch(e.target.value)}
                        placeholder="اكتب اسم النطاق المطلوب..."
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                      />
                    </div>
                    <button
                      onClick={handleDomainSearch}
                      disabled={isSearching || !domainSearch.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSearching ? (
                        <>
                          <i className="ri-loader-line loading-spin"></i>
                          <span>جاري البحث...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-search-line"></i>
                          <span>بحث</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-4">نتائج البحث</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((result, index) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                result.available ? 'bg-green-400' : 'bg-red-400'
                              }`}></div>
                              <span className="font-medium text-white">{result.domain}</span>
                              {result.premium && (
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 text-xs rounded-full">
                                  متميز
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-slate-400">السعر: </span>
                              <span className="text-white font-semibold">{result.price} ريال/سنة</span>
                            </div>
                            {result.available ? (
                              <button
                                onClick={() => handleDomainPurchase(result.domain)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap"
                              >
                                حجز الآن
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-slate-600 text-slate-400 px-4 py-2 rounded text-sm cursor-not-allowed whitespace-nowrap"
                              >
                                غير متاح
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Domain Tips */}
                <div className="bg-slate-700 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">نصائح لاختيار النطاق المثالي</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <i className="ri-lightbulb-line text-yellow-400 text-lg mt-1"></i>
                      <div>
                        <h5 className="font-medium text-white mb-1">اجعله قصيراً وسهلاً</h5>
                        <p className="text-slate-400 text-sm">اختر أسماء قصيرة وسهلة التذكر والكتابة</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-shield-check-line text-green-400 text-lg mt-1"></i>
                      <div>
                        <h5 className="font-medium text-white mb-1">تجنب الأرقام والشرطات</h5>
                        <p className="text-slate-400 text-sm">النطاقات البسيطة أكثر احترافية وسهولة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Domains Tab */}
            {activeTab === 'my-domains' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">نطاقاتي المملوكة</h3>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <i className="ri-add-line"></i>
                    <span>حجز نطاق جديد</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {myDomains.map((domain) => (
                    <div key={domain.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{domain.domain}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                              {getStatusText(domain.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">انتهاء الصلاحية: </span>
                              <span className="text-white">{domain.expiresAt}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">المشروع المربوط: </span>
                              <span className="text-white">{domain.connectedProject || 'غير مربوط'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">التجديد التلقائي: </span>
                              <span className={domain.autoRenew ? 'text-green-400' : 'text-red-400'}>
                                {domain.autoRenew ? 'مفعل' : 'معطل'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap">
                            <i className="ri-settings-line mr-2"></i>
                            إدارة
                          </button>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap">
                            <i className="ri-refresh-line mr-2"></i>
                            تجديد
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connect Domains Tab */}
            {activeTab === 'connect' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">ربط النطاقات بالمشاريع</h3>
                
                <div className="bg-slate-700 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">ربط نطاق مخصص</h4>
                  <form className="space-y-4" id="connect-domain-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">اختر النطاق</label>
                        <select
                          name="selectedDomain"
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                        >
                          <option value="">اختر نطاقاً...</option>
                          {myDomains.map((domain) => (
                            <option key={domain.id} value={domain.domain}>{domain.domain}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">اختر المشروع</label>
                        <select
                          name="selectedProject"
                          className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
                        >
                          <option value="">اختر مشروعاً...</option>
                          <option value="1">موقع الشركة الرئيسي</option>
                          <option value="2">متجر الإلكترونيات</option>
                          <option value="3">مدونة التقنية</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-links-line"></i>
                        <span>ربط النطاق</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-slate-700 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">إرشادات الربط</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">1</div>
                      <div>
                        <h5 className="font-medium text-white">اختر النطاق والمشروع</h5>
                        <p className="text-slate-400 text-sm">حدد النطاق المطلوب ربطه مع المشروع المناسب</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">2</div>
                      <div>
                        <h5 className="font-medium text-white">تحديث DNS</h5>
                        <p className="text-slate-400 text-sm">سنقوم بتحديث إعدادات DNS تلقائياً عبر Hostinger API</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">3</div>
                      <div>
                        <h5 className="font-medium text-white">تفعيل SSL</h5>
                        <p className="text-slate-400 text-sm">سيتم تفعيل شهادة SSL مجانية لحماية موقعك</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
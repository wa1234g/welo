'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface Domain {
  id: string;
  domain_name: string;
  status: string;
  expires_at: string;
  project_id: number;
  project_name?: string;
  auto_renew: boolean;
  ssl_enabled?: boolean;
  dns_managed?: boolean;
}

interface DomainSearchResult {
  domain: string;
  available: boolean;
  price: number;
  premium?: boolean;
}

export default function Domains() {
  const [activeTab, setActiveTab] = useState('search');
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myDomains, setMyDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchUserDomains();
    fetchUserProjects();
  }, []);

  const fetchUserDomains = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/domains/');
      
      if (response.success) {
        setMyDomains(response.data.domains);
      } else {
        setError('فشل في جلب النطاقات');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetchApi('/api/projects/');
      
      if (response.success) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleDomainSearch = async () => {
    if (!domainSearch.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetchApi(`/api/domains/available?domain=${domainSearch}`);

      if (response.success) {
        const results = [
          {
            domain: response.data.domain,
            available: response.data.available,
            price: response.data.price,
            premium: false
          }
        ];

        if (response.data.suggestions && response.data.suggestions.length > 0) {
          response.data.suggestions.forEach((suggestion: string) => {
            results.push({
              domain: suggestion,
              available: true,
              price: response.data.price,
              premium: false
            });
          });
        }

        setSearchResults(results);
      } else {
        toast.error('فشل في البحث عن النطاق');
      }
    } catch (err) {
      console.error('Error searching domain:', err);
      toast.error('حدث خطأ أثناء البحث عن النطاق');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDomainPurchase = async (domain: string) => {
    try {
      if (projects.length === 0) {
        toast.error('يجب إنشاء مشروع أولاً قبل حجز النطاق');
        return;
      }

      const projectId = projects[0].id;

      const response = await fetchApi('/api/domains/register', {
        method: 'POST',
        body: JSON.stringify({
          domain: domain,
          project_id: projectId,
          auto_renew: true
        })
      });

      if (response.success) {
        toast.success(`تم حجز النطاق ${domain} بنجاح!`);
        fetchUserDomains(); // Refresh the domains list
        setActiveTab('my-domains'); // Switch to my domains tab
      } else {
        toast.error('فشل في حجز النطاق');
      }
    } catch (err) {
      console.error('Error purchasing domain:', err);
      toast.error('حدث خطأ أثناء حجز النطاق');
    }
  };

  const handleConnectDomain = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const domainId = formData.get('selectedDomain') as string;
    const projectId = formData.get('selectedProject') as string;
    
    if (!domainId || !projectId) {
      toast.error('يرجى اختيار النطاق والمشروع');
      return;
    }
    
    try {
      const response = await fetchApi(`/api/domains/${domainId}/connect`, {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId
        })
      });
      
      if (response.success) {
        toast.success('تم ربط النطاق بالمشروع بنجاح');
        fetchUserDomains(); // Refresh domains list
      } else {
        toast.error('فشل في ربط النطاق بالمشروع');
      }
    } catch (err) {
      console.error('Error connecting domain:', err);
      toast.error('حدث خطأ أثناء ربط النطاق');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'suspended': return 'bg-orange-500/20 text-orange-400';
      case 'transferred': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'pending': return 'قيد المعالجة';
      case 'expired': return 'منتهي الصلاحية';
      case 'suspended': return 'معلق';
      case 'transferred': return 'تم نقله';
      default: return 'غير معروف';
    }
  };

  return (
    <DashboardLayout title="إدارة النطاقات" currentPath="/domains">
      <div className="space-y-6 font-cairo">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">جاري تحميل النطاقات...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">حدث خطأ</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchUserDomains}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
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
                            <h4 className="text-lg font-semibold text-white">{domain.domain_name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                              {getStatusText(domain.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">انتهاء الصلاحية: </span>
                              <span className="text-white">{new Date(domain.expires_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">المشروع المربوط: </span>
                              <span className="text-white">{domain.project_name || 'غير مربوط'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">التجديد التلقائي: </span>
                              <span className={domain.auto_renew ? 'text-green-400' : 'text-red-400'}>
                                {domain.auto_renew ? 'مفعل' : 'معطل'}
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
                            <option key={domain.id} value={domain.id}>{domain.domain_name}</option>
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

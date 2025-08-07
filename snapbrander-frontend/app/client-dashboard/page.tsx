
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const userProjects = [
    {
      id: 1,
      name: 'موقع شركتي',
      domain: 'mycompany.fureraa.com',
      status: 'active',
      created: '2024-01-15',
      visitors: 1250,
      url: 'https://mycompany.fureraa.com',
      loginUrl: '/wp-admin',
      username: 'admin',
      canChangePassword: true
    },
    {
      id: 2,
      name: 'متجري الإلكتروني',
      domain: 'mystore.fureraa.com',
      status: 'development',
      created: '2024-01-20',
      visitors: 0,
      url: 'https://mystore.fureraa.com',
      loginUrl: '/wp-admin',
      username: 'admin',
      canChangePassword: true
    }
  ];

  const subscription = {
    plan: 'الاحترافي',
    status: 'active',
    nextBilling: '2024-02-15',
    amount: 79,
    projectsUsed: 2,
    projectsLimit: 25,
    storageUsed: 2.4,
    storageLimit: 10
  };

  const handleChangePassword = (projectId) => {
    window.location.href = `/client-dashboard/change-password/${projectId}`;
  };

  const handleLoginToSite = (project) => {
    window.open(`${project.url}${project.loginUrl}`, '_blank');
  };

  const handleSiteAnalysis = (projectId) => {
    window.location.href = `/client-dashboard/site-analysis/${projectId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'development': return 'bg-yellow-500/20 text-yellow-400';
      case 'paused': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'development': return 'قيد التطوير';
      case 'paused': return 'متوقف';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-cairo">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold text-white">SnapBrander</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">مرحباً، أحمد محمد</div>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h2>
                <p className="text-purple-100">إدارة مواقعك واشتراكك بسهولة</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-100">مشاريعك النشطة</div>
                <div className="text-2xl font-bold">{userProjects.length}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="ri-global-line text-white"></i>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{subscription.projectsUsed}</div>
                  <div className="text-slate-400 text-sm">المشاريع المستخدمة</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <i className="ri-eye-line text-white"></i>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {userProjects.reduce((sum, p) => sum + p.visitors, 0).toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">إجمالي الزوار</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <i className="ri-hard-drive-line text-white"></i>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{subscription.storageUsed} GB</div>
                  <div className="text-slate-400 text-sm">المساحة المستخدمة</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <i className="ri-vip-crown-line text-white"></i>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{subscription.plan}</div>
                  <div className="text-slate-400 text-sm">الخطة الحالية</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-slate-800 rounded-xl">
            <div className="border-b border-slate-700">
              <div className="flex">
                {[ 
                  { id: 'overview', label: 'نظرة عامة', icon: 'ri-dashboard-line' },
                  { id: 'projects', label: 'مواقعي', icon: 'ri-global-line' },
                  { id: 'subscription', label: 'اشتراكي', icon: 'ri-vip-crown-line' },
                  { id: 'profile', label: 'الملف الشخصي', icon: 'ri-user-line' }
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">نظرة عامة على حسابك</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Projects */}
                    <div>
                      <h4 className="font-semibold text-white mb-4">مشاريعك الأخيرة</h4>
                      <div className="space-y-3">
                        {userProjects.slice(0, 3).map((project) => (
                          <div key={project.id} className="bg-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-white">{project.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {getStatusText(project.status)}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm">{project.domain}</p>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-slate-400 text-sm">{project.visitors.toLocaleString()} زائر</span>
                              <Link
                                href={`/client-dashboard/project/${project.id}`}
                                className="text-purple-400 hover:text-purple-300 text-sm"
                              >
                                إدارة
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div>
                      <h4 className="font-semibold text-white mb-4">معلومات الاشتراك</h4>
                      <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">الخطة الحالية:</span>
                          <span className="text-white">{subscription.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">الحالة:</span>
                          <span className="text-green-400">نشطة</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">التجديد التالي:</span>
                          <span className="text-white">{subscription.nextBilling}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">المبلغ:</span>
                          <span className="text-white">{subscription.amount} ريال/شهر</span>
                        </div>
                        <div className="pt-3 border-t border-slate-600">
                          <Link
                            href="/payment"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors block text-center whitespace-nowrap"
                          >
                            ترقية الاشتراك
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">مواقعي</h3>
                    <Link
                      href="/website-generator"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <i className="ri-add-line"></i>
                      <span>موقع جديد</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProjects.map((project) => (
                      <div key={project.id} className="bg-slate-700 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-1">{project.name}</h4>
                            <p className="text-slate-400 text-sm">{project.domain}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">تاريخ الإنشاء:</span>
                            <span className="text-white">{project.created}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">عدد الزوار:</span>
                            <span className="text-white">{project.visitors.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">اسم المستخدم:</span>
                            <span className="text-white">{project.username}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button
                            onClick={() => handleLoginToSite(project)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors whitespace-nowrap"
                          >
                            <i className="ri-login-box-line ml-1"></i>
                            تسجيل الدخول
                          </button>
                          <button
                            onClick={() => handleChangePassword(project.id)}
                            disabled={!project.canChangePassword}
                            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            <i className="ri-key-line ml-1"></i>
                            تغيير كلمة المرور
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button
                            onClick={() => handleSiteAnalysis(project.id)}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors whitespace-nowrap"
                          >
                            <i className="ri-speed-line ml-1"></i>
                            فحص الموقع
                          </button>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors text-center whitespace-nowrap"
                          >
                            <i className="ri-external-link-line ml-1"></i>
                            زيارة الموقع
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">تفاصيل اشتراكي</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-700 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4">معلومات الخطة</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">الخطة:</span>
                          <span className="text-white font-semibold">{subscription.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">المبلغ الشهري:</span>
                          <span className="text-white">{subscription.amount} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">التجديد التالي:</span>
                          <span className="text-white">{subscription.nextBilling}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">الحالة:</span>
                          <span className="text-green-400">نشطة</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4">الاستخدام</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">المشاريع</span>
                            <span className="text-white">{subscription.projectsUsed}/{subscription.projectsLimit}</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(subscription.projectsUsed / subscription.projectsLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">مساحة التخزين</span>
                            <span className="text-white">{subscription.storageUsed}/{subscription.storageLimit} GB</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(subscription.storageUsed / subscription.storageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/payment?plan=enterprise"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-vip-crown-line"></i>
                      <span>ترقية الاشتراك</span>
                    </Link>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap">
                      <i className="ri-close-line"></i>
                      <span>إلغاء الاشتراك</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">الملف الشخصي</h3>
                  
                  <form className="space-y-6" id="profile-form">
                    <div className="bg-slate-700 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4">المعلومات الأساسية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
                          <input
                            type="text"
                            name="fullName"
                            defaultValue="أحمد محمد"
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                          <input
                            type="email"
                            name="email"
                            defaultValue="ahmed@example.com"
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-4">تغيير كلمة المرور</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور الحالية</label>
                          <input
                            type="password"
                            name="currentPassword"
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            name="newPassword"
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">تأكيد كلمة المرور</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-save-line"></i>
                        <span>حفظ التغييرات</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

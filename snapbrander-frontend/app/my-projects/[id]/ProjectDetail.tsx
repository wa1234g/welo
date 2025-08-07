
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

interface ProjectDetailProps {
  projectId: string;
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const project = {
    id: projectId,
    name: 'موقع الشركة الرئيسي',
    domain: 'company.fureraa.com',
    status: 'active',
    template: 'Business Pro',
    created: '2024-01-15',
    lastUpdate: '2024-01-20',
    visitors: 1250,
    pageViews: 5680,
    bounceRate: 45,
    avgSession: '2:34',
    image: 'https://readdy.ai/api/search-image?query=modern%20business%20website%20homepage%20with%20professional%20design%2C%20corporate%20layout%2C%20clean%20interface%2C%20full%20page%20view&width=800&height=600&seq=project-detail&orientation=landscape'
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: 'ri-dashboard-line' },
    { id: 'analytics', label: 'التحليلات', icon: 'ri-bar-chart-line' },
    { id: 'content', label: 'المحتوى', icon: 'ri-file-text-line' },
    { id: 'design', label: 'التصميم', icon: 'ri-palette-line' },
    { id: 'settings', label: 'الإعدادات', icon: 'ri-settings-line' }
  ];

  const recentActivities = [
    { action: 'تم تحديث الصفحة الرئيسية', time: 'منذ ساعتين', icon: 'ri-edit-line' },
    { action: 'تم إضافة صفحة جديدة', time: 'منذ 4 ساعات', icon: 'ri-add-line' },
    { action: 'تم تحديث قالب التصميم', time: 'أمس', icon: 'ri-palette-line' },
    { action: 'تم نشر المحتوى', time: 'منذ يومين', icon: 'ri-send-plane-line' }
  ];

  const pages = [
    { name: 'الصفحة الرئيسية', path: '/', visits: 2340, status: 'published' },
    { name: 'من نحن', path: '/about', visits: 890, status: 'published' },
    { name: 'الخدمات', path: '/services', visits: 1250, status: 'published' },
    { name: 'اتصل بنا', path: '/contact', visits: 670, status: 'draft' },
    { name: 'المدونة', path: '/blog', visits: 450, status: 'published' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      default: return 'غير معروف';
    }
  };

  return (
    <DashboardLayout title={project.name} currentPath="/my-projects">
      <div className="space-y-6">
        {/* Project Header */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <img 
                src={project.image}
                alt={project.name}
                className="w-full h-48 lg:h-64 object-cover object-top rounded-lg"
              />
            </div>
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                  <p className="text-slate-400 flex items-center gap-2 mb-4">
                    <i className="ri-global-line"></i>
                    {project.domain}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{project.visitors.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">زائر</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{project.pageViews.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">مشاهدة</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{project.bounceRate}%</div>
                  <div className="text-sm text-slate-400">معدل الارتداد</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{project.avgSession}</div>
                  <div className="text-sm text-slate-400">متوسط الجلسة</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                  <i className="ri-eye-line"></i>
                  <span>معاينة الموقع</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                  <i className="ri-edit-line"></i>
                  <span>تحرير المحتوى</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                  <i className="ri-download-line"></i>
                  <span>تصدير الموقع</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Project Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">معلومات المشروع</h3>
                    <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">القالب:</span>
                        <span className="text-white">{project.template}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">تاريخ الإنشاء:</span>
                        <span className="text-white">{project.created}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">آخر تحديث:</span>
                        <span className="text-white">{project.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">النطاق:</span>
                        <span className="text-white">{project.domain}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">الأنشطة الأخيرة</h3>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 py-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <i className={`${activity.icon} text-sm text-white`}></i>
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm">{activity.action}</p>
                              <p className="text-slate-400 text-xs">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">صفحات الموقع</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
                    <i className="ri-add-line"></i>
                    <span>صفحة جديدة</span>
                  </button>
                </div>
                <div className="bg-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-600">
                      <tr>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">اسم الصفحة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">المسار</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الزيارات</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-slate-200 font-medium">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((page, index) => (
                        <tr key={index} className="border-t border-slate-600">
                          <td className="py-3 px-4 text-white">{page.name}</td>
                          <td className="py-3 px-4 text-slate-400">{page.path}</td>
                          <td className="py-3 px-4 text-white">{page.visits.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                              {getStatusText(page.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="text-green-400 hover:text-green-300">
                                <i className="ri-eye-line"></i>
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs content can be added similarly */}
            {activeTab !== 'overview' && activeTab !== 'content' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <i className="ri-tools-line text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">قيد التطوير</h3>
                <p className="text-slate-400">هذا القسم قيد التطوير حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-start">
          <Link
            href="/my-projects"
            className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-arrow-right-line"></i>
            <span>العودة للمشاريع</span>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

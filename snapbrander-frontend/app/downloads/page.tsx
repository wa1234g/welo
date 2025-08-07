
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

export default function Downloads() {
  const [filter, setFilter] = useState('all');

  const downloads = [
    {
      id: 1,
      name: 'موقع الشركة الرئيسي',
      type: 'WordPress Export',
      size: '15.2 MB',
      format: 'ZIP',
      createdAt: '2024-01-25',
      downloadCount: 3,
      status: 'ready',
      project: 'company-website'
    },
    {
      id: 2,
      name: 'متجر الإلكترونيات',
      type: 'Static HTML',
      size: '8.7 MB',
      format: 'ZIP',
      createdAt: '2024-01-24',
      downloadCount: 1,
      status: 'ready',
      project: 'electronics-store'
    },
    {
      id: 3,
      name: 'معرض الأعمال الفنية',
      type: 'WordPress Theme',
      size: '22.1 MB',
      format: 'ZIP',
      createdAt: '2024-01-23',
      downloadCount: 0,
      status: 'processing',
      project: 'art-portfolio'
    },
    {
      id: 4,
      name: 'مدونة التقنية',
      type: 'Full Backup',
      size: '45.8 MB',
      format: 'ZIP',
      createdAt: '2024-01-22',
      downloadCount: 5,
      status: 'ready',
      project: 'tech-blog'
    },
    {
      id: 5,
      name: 'موقع المطعم',
      type: 'WordPress Export',
      size: '12.3 MB',
      format: 'ZIP',
      createdAt: '2024-01-21',
      downloadCount: 2,
      status: 'expired',
      project: 'restaurant-site'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready': return 'جاهز للتحميل';
      case 'processing': return 'قيد المعالجة';
      case 'expired': return 'منتهي الصلاحية';
      case 'error': return 'خطأ';
      default: return 'غير معروف';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'WordPress Export': return 'ri-wordpress-line';
      case 'Static HTML': return 'ri-code-line';
      case 'WordPress Theme': return 'ri-layout-line';
      case 'Full Backup': return 'ri-cloud-line';
      default: return 'ri-file-line';
    }
  };

  const filteredDownloads = downloads.filter(download => {
    if (filter === 'all') return true;
    return download.status === filter;
  });

  const handleDownload = (download) => {
    if (download.status === 'ready') {
      alert(`تم بدء تحميل: ${download.name}`);
    } else if (download.status === 'expired') {
      alert('انتهت صلاحية هذا الملف. يرجى إنشاء نسخة جديدة.');
    } else {
      alert('هذا الملف غير جاهز للتحميل حالياً.');
    }
  };

  const handleRegenerate = (download) => {
    alert(`جاري إنشاء نسخة جديدة من: ${download.name}`);
  };

  const handleDelete = (download) => {
    if (confirm(`هل أنت متأكد من حذف: ${download.name}؟`)) {
      alert('تم حذف الملف بنجاح!');
    }
  };

  return (
    <DashboardLayout title="تحميل المخرجات" currentPath="/downloads">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">مركز التحميلات</h2>
              <p className="text-slate-400">تحميل وإدارة ملفات المشاريع المُصدرة</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-slate-400">إجمالي الملفات</div>
                <div className="text-xl font-bold text-white">{downloads.length}</div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <i className="ri-download-cloud-line text-2xl text-white"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'جاهز للتحميل', 
              value: downloads.filter(d => d.status === 'ready').length, 
              icon: 'ri-check-line', 
              color: 'bg-green-600' 
            },
            { 
              label: 'قيد المعالجة', 
              value: downloads.filter(d => d.status === 'processing').length, 
              icon: 'ri-loader-line', 
              color: 'bg-yellow-600' 
            },
            { 
              label: 'منتهي الصلاحية', 
              value: downloads.filter(d => d.status === 'expired').length, 
              icon: 'ri-time-line', 
              color: 'bg-red-600' 
            },
            { 
              label: 'إجمالي التحميلات', 
              value: downloads.reduce((sum, d) => sum + d.downloadCount, 0), 
              icon: 'ri-download-line', 
              color: 'bg-blue-600' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-white text-lg`}></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'ready', label: 'جاهز' },
                { id: 'processing', label: 'قيد المعالجة' },
                { id: 'expired', label: 'منتهي الصلاحية' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                    filter === filterOption.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 whitespace-nowrap">
                <i className="ri-refresh-line"></i>
                <span>تحديث القائمة</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 whitespace-nowrap">
                <i className="ri-delete-bin-line"></i>
                <span>حذف المنتهية الصلاحية</span>
              </button>
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">اسم الملف</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">النوع</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الحجم</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">تاريخ الإنشاء</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">عدد التحميلات</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الحالة</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.map((download) => (
                  <tr key={download.id} className="border-t border-slate-600 hover:bg-slate-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                          <i className={`${getTypeIcon(download.type)} text-white text-lg`}></i>
                        </div>
                        <div>
                          <div className="font-medium text-white">{download.name}</div>
                          <div className="text-sm text-slate-400">{download.project}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white text-sm">{download.type}</div>
                      <div className="text-slate-400 text-xs">{download.format}</div>
                    </td>
                    <td className="py-4 px-6 text-white">{download.size}</td>
                    <td className="py-4 px-6 text-slate-400">{download.createdAt}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-white">
                        <i className="ri-download-line text-sm"></i>
                        {download.downloadCount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                        {getStatusText(download.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownload(download)}
                          disabled={download.status === 'processing'}
                          className={`p-2 rounded text-sm ${
                            download.status === 'ready' 
                              ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20' 
                              : download.status === 'expired'
                              ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20'
                              : 'text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <i className="ri-download-line"></i>
                        </button>
                        <button 
                          onClick={() => handleRegenerate(download)}
                          className="p-2 rounded text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        >
                          <i className="ri-refresh-line"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(download)}
                          className="p-2 rounded text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDownloads.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                <i className="ri-download-cloud-line text-2xl text-slate-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">لا توجد ملفات</h3>
              <p className="text-slate-400 mb-4">لا توجد ملفات تحميل متاحة في هذا الفلتر</p>
            </div>
          )}
        </div>

        {/* Download Tips */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">نصائح التحميل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-information-line text-blue-400"></i>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">صلاحية الملفات</h4>
                <p className="text-slate-400 text-sm">ملفات التحميل متاحة لمدة 7 أيام من تاريخ الإنشاء</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-refresh-line text-green-400"></i>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">إعادة الإنشاء</h4>
                <p className="text-slate-400 text-sm">يمكن إعادة إنشاء أي ملف منتهي الصلاحية في أي وقت</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-file-zip-line text-purple-400"></i>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">تنسيقات متعددة</h4>
                <p className="text-slate-400 text-sm">تصدير المشاريع بتنسيقات مختلفة حسب الحاجة</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-check-line text-orange-400"></i>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">الأمان</h4>
                <p className="text-slate-400 text-sm">جميع الملفات محمية ومتاحة للمالك فقط</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

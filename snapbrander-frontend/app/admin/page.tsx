
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = {
    totalUsers: 1247,
    activeProjects: 89,
    totalTemplates: 24,
    serverUptime: '99.9%',
    storageUsed: '67%',
    dailyBackups: 'تلقائي'
  };

  const recentLogs = [
    { id: 1, action: 'تم تسجيل مستخدم جديد', user: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'info' },
    { id: 2, action: 'تم رفع قالب جديد للمراجعة', user: 'سارة أحمد', time: 'منذ 15 دقيقة', type: 'warning' },
    { id: 3, action: 'تم إنشاء مشروع جديد', user: 'محمد علي', time: 'منذ 30 دقيقة', type: 'success' },
    { id: 4, action: 'خطأ في النظام - تم الإصلاح', user: 'النظام', time: 'منذ ساعة', type: 'error' },
    { id: 5, action: 'تحديث النظام مكتمل', user: 'النظام', time: 'منذ 3 ساعات', type: 'info' }
  ];

  const pendingActions = [
    { id: 1, title: 'مراجعة قوالب جديدة', count: 5, type: 'templates', priority: 'high' },
    { id: 2, title: 'طلبات إنشاء حسابات', count: 12, type: 'accounts', priority: 'medium' },
    { id: 3, title: 'تقارير مشاكل فنية', count: 3, type: 'issues', priority: 'high' },
    { id: 4, title: 'تحديث الخادم', count: 1, type: 'system', priority: 'low' }
  ];

  const serverMetrics = [
    { name: 'استخدام المعالج', value: 45, color: 'bg-blue-500' },
    { name: 'استخدام الذاكرة', value: 62, color: 'bg-green-500' },
    { name: 'مساحة القرص', value: 67, color: 'bg-yellow-500' },
    { name: 'شبكة الإنترنت', value: 23, color: 'bg-purple-500' }
  ];

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <DashboardLayout title="إدارة النظام" currentPath="/admin">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">لوحة تحكم النظام</h2>
              <p className="text-red-100">مراقبة وإدارة جميع جوانب المنصة</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-red-100">وقت تشغيل الخادم</div>
                <div className="text-xl font-bold">{systemStats.serverUptime}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-line text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'المستخدمين', value: systemStats.totalUsers, icon: 'ri-group-line', color: 'bg-blue-600' },
            { label: 'المشاريع النشطة', value: systemStats.activeProjects, icon: 'ri-rocket-line', color: 'bg-green-600' },
            { label: 'القوالب', value: systemStats.totalTemplates, icon: 'ri-layout-line', color: 'bg-purple-600' },
            { label: 'التخزين المستخدم', value: systemStats.storageUsed, icon: 'ri-hard-drive-line', color: 'bg-orange-600' },
            { label: 'النسخ الاحتياطية', value: systemStats.dailyBackups, icon: 'ri-cloud-line', color: 'bg-teal-600' },
            { label: 'وقت التشغيل', value: systemStats.serverUptime, icon: 'ri-time-line', color: 'bg-indigo-600' }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">مقاييس الخادم</h3>
              <div className="space-y-6">
                {serverMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm">{metric.name}</span>
                      <span className="text-white font-medium">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div>
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">الإجراءات المعلقة</h3>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{action.count}</span>
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{action.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority === 'high' ? 'عاجل' : action.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300">
                      <i className="ri-arrow-left-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">سجل النظام</h3>
            <div className="flex gap-2">
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm">
                تصدير السجل
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
                مسح السجل
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'success' ? 'bg-green-400' :
                    log.type === 'warning' ? 'bg-yellow-400' :
                    log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div>
                    <div className="text-white text-sm font-medium">{log.action}</div>
                    <div className="text-slate-400 text-xs">{log.user} • {log.time}</div>
                  </div>
                </div>
                <i className={`ri-information-line ${getLogTypeColor(log.type)}`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'ri-refresh-line', title: 'إعادة تشغيل الخادم', description: 'إعادة تشغيل جميع الخدمات', color: 'bg-blue-600' },
              { icon: 'ri-database-2-line', title: 'نسخ احتياطي', description: 'إنشاء نسخة احتياطية فورية', color: 'bg-green-600' },
              { icon: 'ri-shield-check-line', title: 'فحص الأمان', description: 'تشغيل فحص أمني شامل', color: 'bg-purple-600' },
              { icon: 'ri-settings-line', title: 'إعدادات النظام', description: 'تخصيص إعدادات المنصة', color: 'bg-orange-600' }
            ].map((action, index) => (
              <button key={index} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-right">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <i className={`${action.icon} text-white text-xl`}></i>
                </div>
                <h4 className="text-white font-medium mb-1">{action.title}</h4>
                <p className="text-slate-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">حالة الخدمات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'خادم الويب', status: 'online', uptime: '100%' },
              { name: 'قاعدة البيانات', status: 'online', uptime: '99.9%' },
              { name: 'التخزين السحابي', status: 'online', uptime: '99.8%' },
              { name: 'النسخ الاحتياطية', status: 'warning', uptime: '98.5%' }
            ].map((service, index) => (
              <div key={index} className="p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">{service.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-400' : 
                    service.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <div className="text-slate-400 text-sm">وقت التشغيل: {service.uptime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function ProfilePage() {
  const [user] = useState({
    id: 1,
    name: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    avatar: null,
    company: 'شركة التقنية المتقدمة',
    position: 'مدير المشاريع',
    bio: 'خبير في تطوير المواقع والتجارة الإلكترونية منذ أكثر من 8 سنوات',
    location: 'الرياض، المملكة العربية السعودية',
    website: 'https://ahmed-portfolio.com',
    joinDate: '2023-06-15',
    lastLogin: '2024-01-15 10:30:00',
    subscription: {
      plan: 'الاحترافي',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-02-01'
    },
    stats: {
      totalProjects: 12,
      activeProjects: 3,
      completedProjects: 9,
      totalVisitors: 25480
    },
    preferences: {
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
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((word: string) => word.charAt(0)).join('').substring(0, 2);
  };

  return (
    <DashboardLayout title="الملف الشخصي" currentPath="/profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-purple-700 transition-colors">
                <i className="ri-camera-line text-sm"></i>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
              <p className="text-purple-100 mb-1">{user.position}</p>
              <p className="text-purple-200 text-sm mb-3">{user.company}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <i className="ri-mail-line"></i>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-phone-line"></i>
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-map-pin-line"></i>
                  <span>{user.location}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/profile/edit"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors whitespace-nowrap"
              >
                <i className="ri-edit-line"></i>
                <span>تعديل الملف</span>
              </Link>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors whitespace-nowrap">
                <i className="ri-share-line"></i>
                <span>مشاركة الملف</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">نبذة عني</h2>
              <p className="text-slate-300 leading-relaxed">{user.bio}</p>
              {user.website && (
                <div className="mt-4">
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
                  >
                    <i className="ri-external-link-line"></i>
                    <span>زيارة موقعي الشخصي</span>
                  </a>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">الإحصائيات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {user.stats.totalProjects}
                  </div>
                  <div className="text-sm text-slate-400">إجمالي المشاريع</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {user.stats.activeProjects}
                  </div>
                  <div className="text-sm text-slate-400">مشاريع نشطة</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {user.stats.completedProjects}
                  </div>
                  <div className="text-sm text-slate-400">مشاريع مكتملة</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {user.stats.totalVisitors.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">إجمالي الزوار</div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">النشاط الأخير</h2>
              <div className="space-y-4">
                {[
                  {
                    action: 'إنشاء موقع جديد',
                    details: 'موقع "شركة التقنية المتقدمة"',
                    time: '2024-01-15 10:30:00',
                    icon: 'ri-add-line',
                    color: 'text-green-400'
                  },
                  {
                    action: 'تحديث الملف الشخصي',
                    details: 'تم تحديث معلومات التواصل',
                    time: '2024-01-14 16:20:00',
                    icon: 'ri-user-line',
                    color: 'text-blue-400'
                  },
                  {
                    action: 'تسجيل دخول',
                    details: 'تسجيل دخول من الرياض',
                    time: '2024-01-14 09:15:00',
                    icon: 'ri-login-box-line',
                    color: 'text-purple-400'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-600 ${activity.color}`}>
                      <i className={activity.icon}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{activity.action}</div>
                      <div className="text-sm text-slate-400">{activity.details}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(activity.time).toLocaleString('ar-SA')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">معلومات الحساب</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">تاريخ الانضمام:</span>
                  <span className="text-white">{formatDate(user.joinDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">آخر تسجيل دخول:</span>
                  <span className="text-white">{formatDate(user.lastLogin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الخطة الحالية:</span>
                  <span className="text-purple-400 font-medium">{user.subscription.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">حالة الاشتراك:</span>
                  <span className="text-green-400">نشط</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line text-purple-400"></i>
                  <span className="text-white">تعديل المعلومات</span>
                </Link>
                <Link
                  href="/profile/security"
                  className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-shield-line text-green-400"></i>
                  <span className="text-white">الأمان والخصوصية</span>
                </Link>
                <Link
                  href="/subscriptions"
                  className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-vip-crown-line text-orange-400"></i>
                  <span className="text-white">إدارة الاشتراك</span>
                </Link>
                <button className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors w-full text-right whitespace-nowrap">
                  <i className="ri-download-line text-blue-400"></i>
                  <span className="text-white">تنزيل البيانات</span>
                </button>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">حالة الأمان</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">قوة كلمة المرور</span>
                  <span className="text-green-400 text-sm">قوية</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">المصادقة الثنائية</span>
                  <span className="text-yellow-400 text-sm">غير مفعلة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">جلسات نشطة</span>
                  <span className="text-white text-sm">2</span>
                </div>
              </div>
              <Link
                href="/profile/security"
                className="block mt-4 text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                تحسين الأمان
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchApi } from '../../utils/api';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_templates: number;
  current_subscription: string;
  storage_used: number;
  storage_limit: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const userResponse = await fetchApi('/api/auth/profile');
      if (userResponse.success) {
        setUser(userResponse.data.user);
      }

      const statsResponse = await fetchApi('/api/analytics/dashboard');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        setStats({
          total_projects: 3,
          active_projects: 2,
          total_templates: 25,
          current_subscription: 'Basic',
          storage_used: 2.5,
          storage_limit: 5
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('حدث خطأ في تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="لوحة التحكم" currentPath="/dashboard">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">جاري تحميل لوحة التحكم...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="لوحة التحكم" currentPath="/dashboard">
      <div className="space-y-6 font-cairo">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                مرحباً {user?.full_name || 'بك'}! 👋
              </h2>
              <p className="text-purple-100">
                مرحباً بك في لوحة تحكم SnapBrander - منصة إنشاء المواقع الذكية
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">الخطة الحالية</div>
              <div className="text-xl font-bold">{stats?.current_subscription || 'Basic'}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-folder-line text-2xl text-blue-400"></i>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.total_projects || 0}</span>
            </div>
            <h3 className="text-slate-300 text-sm">إجمالي المشاريع</h3>
            <p className="text-green-400 text-xs mt-1">
              {stats?.active_projects || 0} مشروع نشط
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-layout-line text-2xl text-purple-400"></i>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.total_templates || 0}</span>
            </div>
            <h3 className="text-slate-300 text-sm">القوالب المتاحة</h3>
            <p className="text-purple-400 text-xs mt-1">جاهزة للاستخدام</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-database-line text-2xl text-green-400"></i>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats?.storage_used || 0}GB
              </span>
            </div>
            <h3 className="text-slate-300 text-sm">المساحة المستخدمة</h3>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full" 
                style={{ 
                  width: `${((stats?.storage_used || 0) / (stats?.storage_limit || 5)) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              من {stats?.storage_limit || 5}GB
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-star-line text-2xl text-yellow-400"></i>
              </div>
              <span className="text-2xl font-bold text-white">Pro</span>
            </div>
            <h3 className="text-slate-300 text-sm">حالة الحساب</h3>
            <p className="text-yellow-400 text-xs mt-1">نشط ومفعل</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">الإجراءات السريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/create-project"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <i className="ri-add-line text-xl"></i>
              <div>
                <h4 className="font-semibold">إنشاء مشروع جديد</h4>
                <p className="text-sm text-purple-100">ابدأ موقعك الجديد الآن</p>
              </div>
            </a>

            <a
              href="/templates"
              className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <i className="ri-layout-line text-xl"></i>
              <div>
                <h4 className="font-semibold">تصفح القوالب</h4>
                <p className="text-sm text-slate-300">اختر من مجموعة متنوعة</p>
              </div>
            </a>

            <a
              href="/domains"
              className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex items-center gap-3 transition-all"
            >
              <i className="ri-global-line text-xl"></i>
              <div>
                <h4 className="font-semibold">إدارة النطاقات</h4>
                <p className="text-sm text-slate-300">احجز نطاقك المخصص</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">النشاط الأخير</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-400"></i>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">تم إنشاء حسابك بنجاح</h4>
                <p className="text-slate-400 text-sm">مرحباً بك في SnapBrander</p>
              </div>
              <span className="text-slate-400 text-sm">الآن</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <i className="ri-gift-line text-blue-400"></i>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">تم تفعيل الخطة المجانية</h4>
                <p className="text-slate-400 text-sm">يمكنك إنشاء حتى 3 مشاريع</p>
              </div>
              <span className="text-slate-400 text-sm">الآن</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

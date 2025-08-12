'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TopNavbarProps {
  title?: string;
}

export default function TopNavbar({ title = 'لوحة التحكم' }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    // محاكاة تسجيل الخروج
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      window.location.href = '/';
    }
  };

  const recentNotifications = [
    {
      id: 1,
      title: 'تم إنشاء موقع جديد',
      message: 'تم إنشاء موقع "شركة التقنية المتقدمة" بنجاح',
      time: 'منذ 30 دقيقة',
      read: false,
      icon: 'ri-check-line',
      type: 'success'
    },
    {
      id: 2,
      title: 'تجديد الاشتراك',
      message: 'سيتم تجديد اشتراكك خلال 3 أيام',
      time: 'منذ ساعة',
      read: false,
      icon: 'ri-time-line',
      type: 'warning'
    },
    {
      id: 3,
      title: 'نسخة احتياطية مكتملة',
      message: 'تم إنشاء نسخة احتياطية لموقع "موقع شركتي"',
      time: 'منذ 3 ساعات',
      read: true,
      icon: 'ri-save-line',
      type: 'info'
    }
  ];

  const unreadCount = recentNotifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <i className="ri-search-line"></i>
          </div>
          <input
            type="text"
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-700 text-white px-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </form>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="relative p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="ri-notification-line text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">الإشعارات</h3>
                <Link 
                  href="/notifications"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  عرض الكل
                </Link>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <i className="ri-notification-off-line text-2xl text-slate-400 mb-2"></i>
                    <p className="text-slate-400 text-sm">لا توجد إشعارات</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700">
                    {recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-slate-700/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-slate-750/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 ${getNotificationColor(notification.type)}`}>
                            <i className={notification.icon}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-slate-500 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {recentNotifications.length > 0 && (
                <div className="p-3 border-t border-slate-700 text-center">
                  <Link
                    href="/notifications"
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    عرض جميع الإشعارات
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded-lg transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              أ
            </div>
            <span className="text-sm">أحمد محمد</span>
            <i className={`ri-arrow-down-s-line transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {/* User Info */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    أ
                  </div>
                  <div>
                    <div className="font-medium text-white">أحمد محمد علي</div>
                    <div className="text-xs text-slate-400">ahmed@example.com</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-user-line"></i>
                  <span>الملف الشخصي</span>
                </Link>
                
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-edit-line"></i>
                  <span>تعديل الملف</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-settings-line"></i>
                  <span>الإعدادات</span>
                </Link>

                <Link
                  href="/subscriptions"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-vip-crown-line"></i>
                  <span>اشتراكي</span>
                </Link>

                <Link
                  href="/notifications"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-notification-line"></i>
                  <span>الإشعارات</span>
                  {unreadCount > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <hr className="my-2 border-slate-700" />

                <Link
                  href="/help"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <i className="ri-question-line"></i>
                  <span>المساعدة</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                >
                  <i className="ri-logout-box-line"></i>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
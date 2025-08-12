'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'تم إنشاء موقع جديد',
      message: 'تم إنشاء موقع "شركة التقنية المتقدمة" بنجاح',
      type: 'success',
      time: '2024-01-15 10:30:00',
      read: false,
      icon: 'ri-check-line'
    },
    {
      id: 2,
      title: 'تجديد الاشتراك',
      message: 'سيتم تجديد اشتراكك في الخطة الاحترافية خلال 3 أيام',
      type: 'warning',
      time: '2024-01-14 15:20:00',
      read: false,
      icon: 'ri-time-line'
    },
    {
      id: 3,
      title: 'إنجاز صفحة جديدة',
      message: 'تم إضافة صفحة "خدماتنا" إلى موقع شركتي',
      type: 'info',
      time: '2024-01-14 09:15:00',
      read: true,
      icon: 'ri-file-add-line'
    },
    {
      id: 4,
      title: 'تحديث أمني مهم',
      message: 'يرجى تحديث كلمة مرور موقع "متجري الإلكتروني" لضمان الأمان',
      type: 'error',
      time: '2024-01-13 18:45:00',
      read: true,
      icon: 'ri-shield-line'
    },
    {
      id: 5,
      title: 'نسخة احتياطية مكتملة',
      message: 'تم إنشاء نسخة احتياطية لموقع "موقع شركتي" بنجاح',
      type: 'success',
      time: '2024-01-13 12:00:00',
      read: true,
      icon: 'ri-save-line'
    },
    {
      id: 6,
      title: 'تحديث في القالب',
      message: 'تم تحديث قالب "Business Pro" إلى الإصدار 2.1',
      type: 'info',
      time: '2024-01-12 14:30:00',
      read: true,
      icon: 'ri-palette-line'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout title="الإشعارات" currentPath="/notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">الإشعارات</h1>
            <p className="text-slate-400">
              لديك {unreadCount} إشعار غير مقروء من أصل {notifications.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <i className="ri-check-double-line"></i>
              <span>تحديد الكل كمقروء</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-800 rounded-xl">
          <div className="border-b border-slate-700">
            <div className="flex">
              {[
                { id: 'all', label: 'الكل', count: notifications.length },
                { id: 'unread', label: 'غير مقروء', count: unreadCount },
                { id: 'read', label: 'مقروء', count: notifications.length - unreadCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    filter === tab.id ? 'bg-purple-500/20' : 'bg-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-700">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-notification-off-line text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">لا توجد إشعارات</h3>
                <p className="text-slate-400">
                  {filter === 'unread' ? 'جميع الإشعارات مقروءة' : 'لا توجد إشعارات في هذا القسم'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-slate-700/50 transition-colors ${
                    !notification.read ? 'bg-slate-750/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <i className={notification.icon}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${notification.read ? 'text-white' : 'text-white'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                          <p className="text-slate-500 text-xs">{formatTime(notification.time)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-slate-400 hover:text-white p-1 transition-colors"
                              title="تحديد كمقروء"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                            title="حذف الإشعار"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="p-6 text-center border-t border-slate-700">
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                تحميل المزيد من الإشعارات
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
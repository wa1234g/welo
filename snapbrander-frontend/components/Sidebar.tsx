'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const menuItems = [
    { name: 'لوحة التحكم', path: '/admin', icon: 'ri-dashboard-line' },
    { name: 'المشاريع', path: '/my-projects', icon: 'ri-folder-line' },
    { name: 'إنشاء موقع', path: '/website-generator', icon: 'ri-add-circle-line' },
    { name: 'القوالب', path: '/templates', icon: 'ri-layout-line' },
    { name: 'المستخدمين', path: '/users', icon: 'ri-user-line' },
    { name: 'الاشتراكات', path: '/subscriptions', icon: 'ri-vip-crown-line' },
    { name: 'الدفع', path: '/payment', icon: 'ri-bank-card-line' },
    { name: 'النطاقات', path: '/domains', icon: 'ri-global-line' },
    { name: 'التحميلات', path: '/downloads', icon: 'ri-download-line' },
    { name: 'الإشعارات', path: '/notifications', icon: 'ri-notification-line' },
    { name: 'الإعدادات', path: '/settings', icon: 'ri-settings-line' }
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-slate-800 text-white overflow-y-auto border-l border-slate-700 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-['Pacifico'] text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="font-['Pacifico'] text-xl font-bold text-white">Fureraa</h1>
            <p className="text-xs text-slate-400">منصة إنشاء المواقع</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activePath === item.path
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3 px-3">إجراءات سريعة</h3>
          <div className="space-y-2">
            <Link
              href="/website-generator"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <i className="ri-magic-line"></i>
              <span>إنشاء موقع سريع</span>
            </Link>
            <Link
              href="/client-dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <i className="ri-customer-service-line"></i>
              <span>لوحة العميل</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <i className="ri-user-settings-line"></i>
              <span>الملف الشخصي</span>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <i className="ri-question-line"></i>
            <span>المساعدة والدعم</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/50">
        <div className="text-center">
          <p className="text-xs text-slate-500">© 2024 Fureraa</p>
          <p className="text-xs text-slate-500">جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
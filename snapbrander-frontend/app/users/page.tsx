
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'admin',
      status: 'active',
      projects: 8,
      joinDate: '2024-01-15',
      lastActive: 'منذ ساعة',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20avatar%20portrait%20with%20modern%20business%20attire%2C%20friendly%20expression%2C%20clean%20background&width=100&height=100&seq=avatar1&orientation=squarish'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      role: 'user',
      status: 'active',
      projects: 5,
      joinDate: '2024-01-20',
      lastActive: 'منذ 3 ساعات',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20avatar%20portrait%20with%20business%20attire%2C%20confident%20look%2C%20modern%20style&width=100&height=100&seq=avatar2&orientation=squarish'
    },
    {
      id: 3,
      name: 'محمد حسن',
      email: 'mohamed@example.com',
      role: 'editor',
      status: 'inactive',
      projects: 12,
      joinDate: '2024-01-10',
      lastActive: 'منذ أسبوع',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20avatar%20portrait%20with%20casual%20business%20look%2C%20approachable%20smile%2C%20neutral%20background&width=100&height=100&seq=avatar3&orientation=squarish'
    },
    {
      id: 4,
      name: 'نور الدين',
      email: 'nour@example.com',
      role: 'user',
      status: 'pending',
      projects: 0,
      joinDate: '2024-01-25',
      lastActive: 'لم يدخل بعد',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20avatar%20portrait%20with%20modern%20styling%2C%20friendly%20demeanor%2C%20professional%20background&width=100&height=100&seq=avatar4&orientation=squarish'
    },
    {
      id: 5,
      name: 'سارة أحمد',
      email: 'sara@example.com',
      role: 'user',
      status: 'active',
      projects: 3,
      joinDate: '2024-01-18',
      lastActive: 'منذ يوم',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20avatar%20portrait%20with%20elegant%20business%20style%2C%20confident%20expression%2C%20clean%20backdrop&width=100&height=100&seq=avatar5&orientation=squarish'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'editor': return 'bg-blue-500/20 text-blue-400';
      case 'user': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'editor': return 'محرر';
      case 'user': return 'مستخدم';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400';
      case 'pending': return 'bg-orange-500/20 text-orange-400';
      case 'banned': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      case 'banned': return 'محظور';
      default: return 'غير معروف';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <DashboardLayout title="إدارة المستخدمين" currentPath="/users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">إدارة المستخدمين</h2>
            <p className="text-slate-400">إدارة وتنظيم حسابات المستخدمين</p>
          </div>
          <Link
            href="/users/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-user-add-line"></i>
            <span>إضافة مستخدم</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي المستخدمين', value: users.length, icon: 'ri-group-line', color: 'bg-blue-600' },
            { label: 'نشط', value: users.filter(u => u.status === 'active').length, icon: 'ri-user-line', color: 'bg-green-600' },
            { label: 'في الانتظار', value: users.filter(u => u.status === 'pending').length, icon: 'ri-time-line', color: 'bg-orange-600' },
            { label: 'المديرين', value: users.filter(u => u.role === 'admin').length, icon: 'ri-shield-user-line', color: 'bg-red-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-white text-xl`}></i>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
              >
                <option value="all">كل الأدوار</option>
                <option value="admin">مدير</option>
                <option value="editor">محرر</option>
                <option value="user">مستخدم</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
              >
                <option value="all">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="pending">في الانتظار</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">المستخدم</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الدور</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الحالة</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">المشاريع</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">آخر نشاط</th>
                  <th className="text-right py-4 px-6 text-slate-200 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-600 hover:bg-slate-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">{user.projects}</td>
                    <td className="py-4 px-6 text-slate-400 text-sm">{user.lastActive}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/users/${user.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <i className="ri-eye-line"></i>
                        </Link>
                        <Link
                          href={`/users/${user.id}/edit`}
                          className="text-green-400 hover:text-green-300"
                        >
                          <i className="ri-edit-line"></i>
                        </Link>
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-2xl text-slate-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">لا يوجد مستخدمين</h3>
              <p className="text-slate-400">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

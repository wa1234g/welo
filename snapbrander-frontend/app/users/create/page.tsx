
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    password: '',
    confirmPassword: '',
    permissions: [] as string[],
    department: '',
    position: ''
  });

  const roles = [
    { id: 'admin', name: 'مدير', description: 'صلاحيات كاملة للنظام' },
    { id: 'editor', name: 'محرر', description: 'إدارة المحتوى والقوالب' },
    { id: 'user', name: 'مستخدم', description: 'إنشاء واستخدام المشاريع' }
  ];

  const permissions = [
    { id: 'create_projects', name: 'إنشاء المشاريع', category: 'المشاريع' },
    { id: 'edit_projects', name: 'تعديل المشاريع', category: 'المشاريع' },
    { id: 'delete_projects', name: 'حذف المشاريع', category: 'المشاريع' },
    { id: 'manage_templates', name: 'إدارة القوالب', category: 'القوالب' },
    { id: 'upload_templates', name: 'رفع القوالب', category: 'القوالب' },
    { id: 'manage_users', name: 'إدارة المستخدمين', category: 'المستخدمين' },
    { id: 'system_settings', name: 'إعدادات النظام', category: 'النظام' },
    { id: 'view_analytics', name: 'عرض التحليلات', category: 'النظام' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    alert('تم إنشاء المستخدم بنجاح!');
  };

  const handleRoleChange = (roleId: string) => {
    setFormData({...formData, role: roleId});
    
    // Auto-assign permissions based on role
    if (roleId === 'admin') {
      setFormData(prev => ({...prev, permissions: permissions.map(p => p.id)}));
    } else if (roleId === 'editor') {
      setFormData(prev => ({...prev, permissions: ['create_projects', 'edit_projects', 'manage_templates', 'upload_templates', 'view_analytics']}));
    } else {
      setFormData(prev => ({...prev, permissions: ['create_projects']}));
    }
  };

  return (
    <DashboardLayout title="إضافة مستخدم جديد" currentPath="/users/create">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} id="create-user-form" className="space-y-6">
          {/* Personal Information */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">المعلومات الشخصية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الأول</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل الاسم الأول"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الأخير</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل الاسم الأخير"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="+966 50 123 4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">القسم</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="اسم القسم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">المنصب</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="المنصب الوظيفي"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">إعدادات الحساب</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">حالة الحساب</label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-8"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="pending">في الانتظار</option>
              </select>
            </div>
          </div>

          {/* Role Selection */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">الدور والصلاحيات</h3>
            <div className="space-y-4 mb-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.role === role.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      formData.role === role.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-slate-500'
                    }`}>
                      {formData.role === role.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{role.name}</h4>
                      <p className="text-sm text-slate-400">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions */}
            <div>
              <h4 className="font-medium text-white mb-4">الصلاحيات المحددة</h4>
              <div className="space-y-4">
                {['المشاريع', 'القوالب', 'المستخدمين', 'النظام'].map((category) => (
                  <div key={category}>
                    <h5 className="text-sm font-medium text-slate-300 mb-2">{category}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.filter(p => p.category === category).map((permission) => (
                        <label key={permission.id} className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, permissions: [...formData.permissions, permission.id]});
                              } else {
                                setFormData({...formData, permissions: formData.permissions.filter(p => p !== permission.id)});
                              }
                            }}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-slate-300">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">الصورة الشخصية</h3>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-2xl text-slate-400"></i>
              </div>
              <p className="text-slate-400 mb-2">اسحب وأفلت الصورة هنا أو</p>
              <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                تصفح الملفات
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Link 
              href="/users"
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <i className="ri-user-add-line"></i>
              <span>إضافة المستخدم</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

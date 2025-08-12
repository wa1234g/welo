'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { fetchApi } from '../../utils/api';
import { toast } from 'react-hot-toast';

interface ClientSite {
  id: number;
  project_id: number;
  project_name: string;
  domain: string;
  status: string;
  created_at: string;
  wp_admin_url: string;
  database_name: string;
}

interface CreateSiteForm {
  project_id: number;
  subdomain: string;
  wp_admin_username: string;
  wp_admin_password: string;
  wp_admin_email: string;
  site_title: string;
  template_id: number;
}

export default function CpanelManagement() {
  const [sites, setSites] = useState<ClientSite[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateSiteForm>({
    project_id: 0,
    subdomain: '',
    wp_admin_username: 'admin',
    wp_admin_password: '',
    wp_admin_email: '',
    site_title: '',
    template_id: 1
  });

  useEffect(() => {
    fetchProjects();
    fetchClientSites();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetchApi('/api/projects/');
      if (response.success) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchClientSites = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/cpanel/client-sites', {
        method: 'GET'
      }, true);
      
      if (response.success) {
        setSites(response.data || []);
      } else {
        toast.error('فشل في جلب مواقع العملاء');
      }
    } catch (err) {
      console.error('Error fetching client sites:', err);
      toast.error('فشل في جلب مواقع العملاء');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id || !formData.wp_admin_password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const response = await fetchApi('/api/cpanel/create-client-site', {
        method: 'POST',
        body: JSON.stringify(formData)
      }, true);

      if (response.success) {
        toast.success('تم إنشاء موقع العميل بنجاح!');
        setShowCreateForm(false);
        fetchClientSites();
        
        setFormData({
          project_id: 0,
          subdomain: '',
          wp_admin_username: 'admin',
          wp_admin_password: '',
          wp_admin_email: '',
          site_title: '',
          template_id: 1
        });
      } else {
        toast.error(response.message || 'فشل في إنشاء موقع العميل');
      }
    } catch (err) {
      console.error('Error creating client site:', err);
      toast.error('حدث خطأ أثناء إنشاء موقع العميل');
    }
  };

  const handleBackupSite = async (projectId: number) => {
    try {
      const response = await fetchApi(`/api/cpanel/backup-site/${projectId}`, {
        method: 'POST'
      });

      if (response.success) {
        toast.success('تم بدء عملية النسخ الاحتياطي');
      } else {
        toast.error('فشل في إنشاء النسخة الاحتياطية');
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      toast.error('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
  };

  return (
    <DashboardLayout title="إدارة cPanel" currentPath="/cpanel">
      <div className="space-y-6 font-cairo">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">إدارة مواقع العملاء</h2>
              <p className="text-green-100">إنشاء وإدارة مواقع WordPress للعملاء مع قواعد بيانات منفصلة</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <i className="ri-add-line"></i>
              <span>إنشاء موقع جديد</span>
            </button>
          </div>
        </div>

        {/* Create Site Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">إنشاء موقع عميل جديد</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleCreateSite} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">المشروع</label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => setFormData({...formData, project_id: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value={0}>اختر مشروعاً...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">النطاق الفرعي</label>
                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({...formData, subdomain: e.target.value})}
                      placeholder="client-name"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">سيصبح: {formData.subdomain || 'client-name'}.snapbrander.com</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">عنوان الموقع</label>
                    <input
                      type="text"
                      value={formData.site_title}
                      onChange={(e) => setFormData({...formData, site_title: e.target.value})}
                      placeholder="اسم موقع العميل"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اسم مستخدم WordPress</label>
                    <input
                      type="text"
                      value={formData.wp_admin_username}
                      onChange={(e) => setFormData({...formData, wp_admin_username: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">كلمة مرور WordPress *</label>
                    <input
                      type="password"
                      value={formData.wp_admin_password}
                      onChange={(e) => setFormData({...formData, wp_admin_password: e.target.value})}
                      placeholder="كلمة مرور قوية"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">بريد المدير الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.wp_admin_email}
                      onChange={(e) => setFormData({...formData, wp_admin_email: e.target.value})}
                      placeholder="admin@client-domain.com"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <i className="ri-rocket-line"></i>
                    <span>إنشاء الموقع</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sites List */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">مواقع العملاء</h3>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400">جاري تحميل المواقع...</p>
              </div>
            ) : sites.length > 0 ? (
              <div className="space-y-4">
                {sites.map((site) => (
                  <div key={site.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{site.project_name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            site.status === 'deployed' ? 'bg-green-500/20 text-green-400' :
                            site.status === 'deploying' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {site.status === 'deployed' ? 'مُنشر' :
                             site.status === 'deploying' ? 'قيد النشر' : 'غير معروف'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">النطاق: </span>
                            <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer" 
                               className="text-green-400 hover:text-green-300">
                              {site.domain}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400">قاعدة البيانات: </span>
                            <span className="text-white">{site.database_name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">تاريخ الإنشاء: </span>
                            <span className="text-white">{new Date(site.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <a
                          href={site.wp_admin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap"
                        >
                          <i className="ri-admin-line mr-2"></i>
                          لوحة WordPress
                        </a>
                        <button
                          onClick={() => handleBackupSite(site.project_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap"
                        >
                          <i className="ri-download-line mr-2"></i>
                          نسخ احتياطي
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <i className="ri-server-line text-3xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد مواقع عملاء</h3>
                <p className="text-slate-400 mb-4">ابدأ بإنشاء موقع العميل الأول</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <i className="ri-add-line"></i>
                  <span>إنشاء موقع جديد</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* cPanel Integration Info */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">معلومات التكامل مع cPanel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">الميزات المتاحة</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-400"></i>
                  <span>إنشاء نطاقات فرعية تلقائياً</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-400"></i>
                  <span>قواعد بيانات منفصلة لكل عميل</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-400"></i>
                  <span>تثبيت WordPress تلقائياً</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-400"></i>
                  <span>تثبيت Elementor والإضافات</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">الأمان والعزل</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <span>عزل كامل بين مواقع العملاء</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <span>نسخ احتياطية منفصلة</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <span>شهادات SSL تلقائية</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <span>مراقبة الأداء والأمان</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

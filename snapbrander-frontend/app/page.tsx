
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    {
      icon: 'ri-star-line',
      label: 'القوالب المتميزة',
      value: '3',
      change: '+5% من الشهر الماضي',
      color: 'bg-purple-600'
    },
    {
      icon: 'ri-time-line', 
      label: 'قيد التطوير',
      value: '0',
      change: '+3% من الشهر الماضي',
      color: 'bg-orange-600'
    },
    {
      icon: 'ri-line-chart-line',
      label: 'المشاريع المنجزة',
      value: '0', 
      change: '+8% من الشهر الماضي',
      color: 'bg-green-600'
    },
    {
      icon: 'ri-global-line',
      label: 'إجمالي المشاريع',
      value: '8',
      change: '+12% من الشهر الماضي',
      color: 'bg-blue-600'
    }
  ];

  const popularTemplates = [
    {
      id: 1,
      name: 'Business Pro',
      type: 'أعمال',
      downloads: 1250,
      rating: 4.8,
      image: 'https://readdy.ai/api/search-image?query=modern%20business%20website%20template%20with%20clean%20professional%20design%2C%20corporate%20layout%2C%20blue%20and%20white%20color%20scheme%2C%20minimalist%20style&width=300&height=200&seq=template1&orientation=landscape'
    },
    {
      id: 2,
      name: 'E-commerce Modern',
      type: 'تجارة إلكترونية', 
      downloads: 890,
      rating: 4.9,
      image: 'https://readdy.ai/api/search-image?query=modern%20ecommerce%20website%20template%20with%20product%20showcase%2C%20shopping%20cart%20design%2C%20clean%20interface%2C%20orange%20and%20white%20colors&width=300&height=200&seq=template2&orientation=landscape'
    },
    {
      id: 3,
      name: 'Creative Portfolio',
      type: 'معرض أعمال',
      downloads: 650,
      rating: 4.7,
      image: 'https://readdy.ai/api/search-image?query=creative%20portfolio%20website%20template%20with%20artistic%20design%2C%20gallery%20layout%2C%20modern%20typography%2C%20colorful%20elements&width=300&height=200&seq=template3&orientation=landscape'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'walid',
      url: 'fureraa.com',
      status: 'قيد التطوير',
      date: 'منذ يومين'
    },
    {
      id: 2,
      name: 'موقع تسويقي',
      url: 'fureraa.com',
      status: 'قيد التطوير', 
      date: 'منذ 3 أيام'
    },
    {
      id: 3,
      name: 'متجر إلكتروني',
      url: 'fureraa.com',
      status: 'قيد التطوير',
      date: 'منذ أسبوع'
    }
  ];

  const quickActions = [
    {
      icon: 'ri-user-add-line',
      title: 'إضافة عضو',
      description: 'إضافة مستخدم جديد للنظام'
    },
    {
      icon: 'ri-star-line',
      title: 'صنع قوالب',
      description: 'إنشاء قالب جديد للمكتبة'
    },
    {
      icon: 'ri-add-line',
      title: 'إنشاء مشروع',
      description: 'بدء مشروع موقع جديد'
    }
  ];

  return (
    <DashboardLayout title="لوحة التحكم" currentPath="/">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-hand-heart-line text-2xl"></i>
                <h2 className="text-2xl font-bold">!مرحبًا، Admin</h2>
              </div>
              <p className="text-purple-100">جاهز لإنشاء موقع جديد؟ ابدأ مشروعك التالي الآن</p>
            </div>
            <Link 
              href="/create-project"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              + إنشاء مشروع جديد
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-white text-xl`}></i>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm mb-2">{stat.label}</div>
              <div className="text-green-400 text-xs">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Templates */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">القوالب الشائعة</h3>
              <Link 
                href="/templates" 
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <i className="ri-arrow-left-line"></i>
              </Link>
            </div>
            <div className="space-y-4">
              {popularTemplates.map((template) => (
                <div key={template.id} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                  <img 
                    src={template.image}
                    alt={template.name}
                    className="w-16 h-12 rounded object-cover object-top"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <i className="ri-star-fill text-sm"></i>
                        <span className="text-sm">{template.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-slate-400">{template.type}</span>
                      <span className="text-sm text-slate-400">{template.downloads} تحميل</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">المشاريع الأخيرة</h3>
              <Link 
                href="/my-projects" 
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <i className="ri-arrow-left-line"></i>
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <i className="ri-global-line text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{project.name}</h4>
                      <p className="text-sm text-slate-400">{project.url}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="inline-flex px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      {project.status}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{project.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const links = ['/users/create', '/templates/create', '/create-project'];
              return (
                <Link 
                  key={index} 
                  href={links[index]}
                  className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <i className={`${action.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{action.title}</h4>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import Link from 'next/link';

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'الأساسي',
      description: 'مثالي للمشاريع الصغيرة والمدونات الشخصية',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      yearlyDiscount: 588,
      features: [
        '5 مشاريع نشطة',
        '10 قوالب متميزة',
        '1 GB مساحة تخزين',
        'نطاق فرعي مجاني',
        'دعم فني أساسي',
        'تحديثات تلقائية',
        'حماية SSL'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'الاحترافي',
      description: 'الأنسب للشركات الناشئة والمتوسطة',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      yearlyDiscount: 1598,
      features: [
        '25 مشروع نشط',
        'جميع القوالب المتميزة',
        '10 GB مساحة تخزين',
        'نطاق مخصص مجاني',
        'تحسين SEO متقدم',
        'إضافات بريميوم',
        'دعم فني أولوية',
        'نسخ احتياطية يومية'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'الشركات',
      description: 'حلول شاملة للشركات الكبيرة',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      yearlyDiscount: 3998,
      features: [
        'مشاريع غير محدودة',
        'جميع القوالب + حصرية',
        '100 GB مساحة تخزين',
        'نطاقات متعددة مخصصة',
        'تحليلات متقدمة',
        'فريق تطوير مخصص',
        'دعم فني مباشر 24/7',
        'تخصيص كامل للمنصة'
      ],
      color: 'from-amber-500 to-orange-500',
      popular: false
    }
  ];

  const currentSubscription = {
    plan: 'professional',
    status: 'active',
    nextBilling: '2024-02-15',
    amount: 799
  };

  const getPrice = (plan) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    return billingCycle === 'yearly' ? plan.yearlyDiscount : 0;
  };

  return (
    <DashboardLayout title="الاشتراكات والخطط" currentPath="/subscriptions">
      <div className="space-y-8 font-cairo">
        {/* Current Subscription Status */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">اشتراكك الحالي</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <i className="ri-vip-crown-line text-yellow-300"></i>
                  <span className="font-semibold">خطة الاحترافي</span>
                  <span className="bg-green-500 px-2 py-1 rounded-full text-xs">نشط</span>
                </div>
                <p className="text-green-100">التجديد التالي: {currentSubscription.nextBilling}</p>
                <p className="text-green-100">المبلغ: {currentSubscription.amount} جنيه شهرياً</p>
              </div>
            </div>
            <div className="text-right">
              <Link
                href="/payment/invoice"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all text-sm whitespace-nowrap"
              >
                عرض الفاتورة
              </Link>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="text-center">
          <div className="inline-flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              شهرياً
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative whitespace-nowrap ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              سنوياً
              <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-800 rounded-2xl p-6 transition-all transform hover:scale-105 ${
                plan.popular
                  ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                  : 'hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                  <i className="ri-vip-crown-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {getPrice(plan).toLocaleString()}
                  <span className="text-lg text-slate-400 font-normal"> جنيه</span>
                </div>
                <div className="text-slate-400 text-sm">
                  {billingCycle === 'yearly' ? 'سنوياً' : 'شهرياً'}
                </div>
                {getSavings(plan) > 0 && (
                  <div className="text-green-400 text-sm mt-1">
                    وفر {getSavings(plan)} جنيه سنوياً
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-300 text-sm">
                    <i className="ri-check-line text-green-400 text-lg"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                {currentSubscription.plan === plan.id ? (
                  <div className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-center font-medium">
                    <i className="ri-check-line mr-2"></i>
                    خطتك الحالية
                  </div>
                ) : (
                  <Link
                    href={`/payment?plan=${plan.id}`}
                    className={`block w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white py-3 px-6 rounded-lg text-center font-medium transition-all whitespace-nowrap`}
                  >
                    {currentSubscription.plan === 'basic' && plan.id !== 'basic' ? 'ترقية' : 'اختيار الخطة'}
                  </Link>
                )}
                {plan.id !== 'basic' && (
                  <button className="w-full border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-white py-2 px-6 rounded-lg text-center transition-all text-sm whitespace-nowrap">
                    مقارنة تفصيلية
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">مقارنة شاملة للخطط</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right py-4 text-slate-300 font-medium">المميزات</th>
                  <th className="text-center py-4 text-slate-300 font-medium">الأساسي</th>
                  <th className="text-center py-4 text-slate-300 font-medium">الاحترافي</th>
                  <th className="text-center py-4 text-slate-300 font-medium">الشركات</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">عدد المشاريع</td>
                  <td className="py-3 text-center">5</td>
                  <td className="py-3 text-center">25</td>
                  <td className="py-3 text-center">غير محدود</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">مساحة التخزين</td>
                  <td className="py-3 text-center">1 GB</td>
                  <td className="py-3 text-center">10 GB</td>
                  <td className="py-3 text-center">100 GB</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">القوالب</td>
                  <td className="py-3 text-center">10 قالب</td>
                  <td className="py-3 text-center">جميع القوالب</td>
                  <td className="py-3 text-center">جميع + حصرية</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">الدعم الفني</td>
                  <td className="py-3 text-center">أساسي</td>
                  <td className="py-3 text-center">أولوية</td>
                  <td className="py-3 text-center">مباشر 24/7</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3">النطاق المخصص</td>
                  <td className="py-3 text-center"><i className="ri-close-line text-red-400"></i></td>
                  <td className="py-3 text-center"><i className="ri-check-line text-green-400"></i></td>
                  <td className="py-3 text-center">متعدد</td>
                </tr>
                <tr>
                  <td className="py-3">تحليلات متقدمة</td>
                  <td className="py-3 text-center"><i className="ri-close-line text-red-400"></i></td>
                  <td className="py-3 text-center"><i className="ri-check-line text-green-400"></i></td>
                  <td className="py-3 text-center"><i className="ri-check-line text-green-400"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">أسئلة شائعة</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">هل يمكنني تغيير خطتي في أي وقت؟</h4>
              <p className="text-slate-400 text-sm">نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. سيتم احتساب الفرق تناسبياً.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">ماذا يحدث عند انتهاء الاشتراك؟</h4>
              <p className="text-slate-400 text-sm">ستحصل على فترة سماح 7 أيام، ثم ستنتقل لخطة مجانية محدودة المميزات.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">هل توجد رسوم إلغاء؟</h4>
              <p className="text-slate-400 text-sm">لا توجد رسوم إلغاء، يمكنك إلغاء اشتراكك في أي وقت من لوحة التحكم.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

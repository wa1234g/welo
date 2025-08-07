'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

interface CurrentSubscription {
  id: string;
  plan_id: number;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  price: number;
  currency: string;
}

export default function Subscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetchApi('/api/subscriptions/plans', {}, false);
      
      if (response.success) {
        setPlans(response.data.plans);
      } else {
        setError('فشل في جلب خطط الاشتراك');
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetchApi('/api/subscriptions/current');
      
      if (response.success && response.data.subscription) {
        setCurrentSubscription(response.data.subscription);
      }
    } catch (err) {
      console.error('Error fetching current subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      const response = await fetchApi('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          subscription_id: planId,
          amount: plans.find(p => p.id === planId)?.price || 0,
          currency: 'EGP'
        })
      });
      
      if (response.success) {
        window.location.href = response.data.payment_url;
      } else {
        toast.error('فشل في إنشاء طلب الدفع');
      }
    } catch (err) {
      console.error('Error creating payment order:', err);
      toast.error('حدث خطأ أثناء إنشاء طلب الدفع');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'canceled': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'pending': return 'قيد المعالجة';
      case 'expired': return 'منتهي الصلاحية';
      case 'canceled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  return (
    <DashboardLayout title="الاشتراكات والخطط" currentPath="/subscriptions">
      <div className="space-y-8 font-cairo">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">جاري تحميل الاشتراكات...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">حدث خطأ</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchSubscriptionPlans}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Current Subscription Status */}
            {currentSubscription && (
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">اشتراكك الحالي</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <i className="ri-vip-crown-line text-yellow-300"></i>
                        <span className="font-semibold">{currentSubscription.plan_name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentSubscription.status)}`}>
                          {getStatusText(currentSubscription.status)}
                        </span>
                      </div>
                      <p className="text-green-100">التجديد التالي: {new Date(currentSubscription.end_date).toLocaleDateString('ar-EG')}</p>
                      <p className="text-green-100">المبلغ: {currentSubscription.price} {currentSubscription.currency} شهرياً</p>
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
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-slate-800 rounded-2xl p-6 transition-all transform hover:scale-105 ${
                    plan.is_popular
                      ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                      : 'hover:shadow-xl'
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        الأكثر شعبية
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <i className="ri-vip-crown-line text-2xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-white mb-2">
                      {plan.price.toLocaleString()}
                      <span className="text-lg text-slate-400 font-normal"> {plan.currency}</span>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {plan.interval === 'yearly' ? 'سنوياً' : 'شهرياً'}
                    </div>
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
                    {currentSubscription && currentSubscription.plan_id === plan.id ? (
                      <div className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-center font-medium">
                        <i className="ri-check-line mr-2"></i>
                        خطتك الحالية
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white py-3 px-6 rounded-lg text-center font-medium transition-all whitespace-nowrap"
                      >
                        اختيار الخطة
                      </button>
                    )}
                    <button className="w-full border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-white py-2 px-6 rounded-lg text-center transition-all text-sm whitespace-nowrap">
                      مقارنة تفصيلية
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

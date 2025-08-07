
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'professional';
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const plans = {
    basic: {
      name: 'الأساسي',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: ['5 مشاريع نشطة', '10 قوالب متميزة', '1 GB مساحة تخزين']
    },
    professional: {
      name: 'الاحترافي',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      features: ['25 مشروع نشط', 'جميع القوالب المتميزة', '10 GB مساحة تخزين']
    },
    enterprise: {
      name: 'الشركات',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      features: ['مشاريع غير محدودة', 'جميع القوالب + حصرية', '100 GB مساحة تخزين']
    }
  };

  const selectedPlan = plans[planId];
  const finalPrice = billingCycle === 'yearly' 
    ? selectedPlan.yearlyPrice 
    : selectedPlan.monthlyPrice;
  const discount = billingCycle === 'yearly' ? (selectedPlan.monthlyPrice * 12 - selectedPlan.yearlyPrice) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to invoice page with payment data
    const paymentData = {
      plan: planId,
      billingCycle,
      paymentMethod,
      amount: Math.round(finalPrice * 1.14),
      ...formData
    };
    
    // Store payment data in localStorage for invoice page
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    // Redirect to invoice page
    window.location.href = '/payment/invoice';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-cairo">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">إتمام عملية الدفع</h1>
        <p className="text-green-100">اختر طريقة الدفع المناسبة لك لتفعيل اشتراكك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Cycle */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">دورة الفوترة</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  billingCycle === 'monthly'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">شهرياً</div>
                  <div className="text-sm text-slate-400">دفع كل شهر</div>
                </div>
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`p-4 rounded-lg border-2 transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                {discount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                    وفر {discount} جنيه
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">سنوياً</div>
                  <div className="text-sm text-slate-400">دفع لمدة عام</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">طريقة الدفع</h3>
            <div className="space-y-4">
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-purple-500' : 'border-slate-500'
                }`}>
                  {paymentMethod === 'card' && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                </div>
                <i className="ri-bank-card-line text-2xl text-blue-400"></i>
                <div>
                  <div className="font-medium text-white">بطاقة ائتمان/مدين</div>
                  <div className="text-sm text-slate-400">Visa, MasterCard</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'wallet' ? 'border-purple-500' : 'border-slate-500'
                }`}>
                  {paymentMethod === 'wallet' && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                </div>
                <i className="ri-wallet-line text-2xl text-green-400"></i>
                <div>
                  <div className="font-medium text-white">المحافظ الرقمية</div>
                  <div className="text-sm text-slate-400">فودافون كاش، أورانج مني، إتصالات كاش</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('installment')}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'installment'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'installment' ? 'border-purple-500' : 'border-slate-500'
                }`}>
                  {paymentMethod === 'installment' && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                </div>
                <i className="ri-calendar-line text-2xl text-purple-400"></i>
                <div>
                  <div className="font-medium text-white">التقسيط</div>
                  <div className="text-sm text-slate-400">قسط على 3، 6، 9، 12 شهر</div>
                </div>
              </label>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">معلومات الفوترة</h3>
            <form onSubmit={handleSubmit} id="payment-form" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">العنوان</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  required
                />
                <div className="text-xs text-slate-400 mt-1">{formData.address.length}/500 حرف</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">المحافظة</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">الرمز البريدي</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-4 border-t border-slate-600">
                  <h4 className="font-medium text-white">تفاصيل البطاقة</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">رقم البطاقة</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">تاريخ انتهاء الصلاحية</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                  />
                  <span className="text-slate-300 text-sm">
                    أوافق على 
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 mx-1">
                      الشروط والأحكام
                    </Link>
                    و
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 mx-1">
                      سياسة الخصوصية
                    </Link>
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 sticky top-6">
            <h3 className="text-xl font-semibold text-white mb-4">ملخص الطلب</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <i className="ri-vip-crown-line text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">خطة {selectedPlan.name}</h4>
                    <p className="text-slate-400 text-sm">{billingCycle === 'yearly' ? 'فوترة سنوية' : 'فوترة شهرية'}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                      <i className="ri-check-line text-green-400"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">المبلغ الأساسي:</span>
                  <span className="text-white">
                    {billingCycle === 'yearly' ? selectedPlan.monthlyPrice * 12 : selectedPlan.monthlyPrice} جنيه
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-400">الخصم السنوي:</span>
                    <span className="text-green-400">-{discount} جنيه</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">ضريبة القيمة المضافة (14%):</span>
                  <span className="text-white">{Math.round(finalPrice * 0.14)} جنيه</span>
                </div>
                <hr className="border-slate-600" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">المجموع:</span>
                  <span className="text-purple-400">{Math.round(finalPrice * 1.14)} جنيه</span>
                </div>
                <div className="text-xs text-slate-400 text-center">
                  {billingCycle === 'yearly' ? 'يُدفع مرة واحدة سنوياً' : 'يُدفع شهرياً'}
                </div>
              </div>

              <button
                type="submit"
                form="payment-form"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <i className="ri-secure-payment-line"></i>
                <span>إتمام الدفع</span>
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <i className="ri-shield-check-line text-green-400"></i>
                  <span>دفع آمن ومحمي بتشفير SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <DashboardLayout title="الدفع والاشتراك" currentPath="/payment">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <PaymentContent />
      </Suspense>
    </DashboardLayout>
  );
}

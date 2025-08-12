'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Invoice() {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Invoice details
  const invoiceNumber = `FUR-${Date.now().toString().slice(-8)}`;
  const invoiceDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

  useEffect(() => {
    const data = localStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      router.push('/payment');
    }
    setIsLoading(false);
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice-content');
    html2pdf().from(element).save(`فاتورة-${invoiceNumber}.pdf`);
  };

  const handleContinue = () => {
    localStorage.removeItem('paymentData');
    router.push('/client-dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-cairo">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل الفاتورة...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return null;
  }

  const selectedPlan = plans[paymentData.plan];
  const basePrice = paymentData.billingCycle === 'yearly' 
    ? selectedPlan.yearlyPrice 
    : selectedPlan.monthlyPrice;
  const tax = Math.round(basePrice * 0.14);
  const totalAmount = basePrice + tax;

  return (
    <div className="min-h-screen bg-slate-900 font-cairo">
      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-bg { background: white !important; }
          .print-text { color: black !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-6">
        {/* Success Message - No Print */}
        <div className="no-print bg-green-600 rounded-xl p-6 text-white mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">تم الدفع بنجاح!</h1>
              <p className="text-green-100">تم تفعيل اشتراكك بنجاح</p>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="bg-white print-bg rounded-xl p-8 shadow-lg">
          {/* Header */}
          <div className="border-b-2 border-slate-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 font-['Pacifico'] mb-2">Fureraa</h1>
                <p className="text-slate-600">منصة إنشاء المواقع بالذكاء الاصطناعي</p>
                <div className="mt-4 text-sm text-slate-600 space-y-1">
                  <p>📧 info@fureraa.com</p>
                  <p>🌐 www.fureraa.com</p>
                  <p>📞 +20 100 123 4567</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">فاتورة</h2>
                <div className="space-y-2 text-sm">
                  <div><strong>رقم الفاتورة:</strong> {invoiceNumber}</div>
                  <div><strong>تاريخ الإصدار:</strong> {invoiceDate}</div>
                  <div><strong>تاريخ الاستحقاق:</strong> {dueDate}</div>
                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                    مدفوعة
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-3">الفاتورة إلى:</h3>
              <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm">
                <div><strong>الاسم:</strong> {paymentData.fullName}</div>
                <div><strong>البريد الإلكتروني:</strong> {paymentData.email}</div>
                <div><strong>الهاتف:</strong> {paymentData.phone}</div>
                <div><strong>العنوان:</strong> {paymentData.address}</div>
                <div><strong>المحافظة:</strong> {paymentData.city}</div>
                <div><strong>الرمز البريدي:</strong> {paymentData.zipCode}</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-3">تفاصيل الاشتراك:</h3>
              <div className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm">
                <div><strong>الخطة:</strong> {selectedPlan.name}</div>
                <div><strong>نوع الفوترة:</strong> {paymentData.billingCycle === 'yearly' ? 'سنوية' : 'شهرية'}</div>
                <div><strong>طريقة الدفع:</strong> {
                  paymentData.paymentMethod === 'card' ? 'بطاقة ائتمان/مدين' :
                  paymentData.paymentMethod === 'wallet' ? 'محفظة رقمية' :
                  paymentData.paymentMethod === 'installment' ? 'تقسيط' : 'غير محدد'
                }</div>
                <div><strong>تاريخ التفعيل:</strong> {invoiceDate}</div>
                <div><strong>صالح حتى:</strong> {
                  paymentData.billingCycle === 'yearly' 
                    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')
                }</div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-4">تفاصيل الخدمات</h3>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-right p-4 font-semibold">الخدمة</th>
                    <th className="text-center p-4 font-semibold">الكمية</th>
                    <th className="text-center p-4 font-semibold">المدة</th>
                    <th className="text-right p-4 font-semibold">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-4">
                      <div className="font-medium">اشتراك خطة {selectedPlan.name}</div>
                      <div className="text-slate-600 text-xs mt-1">
                        {selectedPlan.features.join(' • ')}
                      </div>
                    </td>
                    <td className="p-4 text-center">1</td>
                    <td className="p-4 text-center">
                      {paymentData.billingCycle === 'yearly' ? '12 شهر' : '1 شهر'}
                    </td>
                    <td className="p-4 text-right font-medium">{basePrice.toLocaleString()} جنيه</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-slate-50 p-6 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>المبلغ الأساسي:</span>
                  <span>{basePrice.toLocaleString()} جنيه</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>ضريبة القيمة المضافة (14%):</span>
                  <span>{tax.toLocaleString()} جنيه</span>
                </div>
                <hr className="border-slate-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي:</span>
                  <span className="text-green-600">{totalAmount.toLocaleString()} جنيه</span>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    <i className="ri-check-circle-line mr-1"></i>
                    تم الدفع بالكامل
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t-2 border-slate-200 pt-6">
            <h3 className="font-bold text-slate-800 mb-4">معلومات الدفع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div><strong>رقم المعاملة:</strong> TXN{Date.now().toString().slice(-10)}</div>
                <div><strong>تاريخ الدفع:</strong> {new Date().toLocaleString('ar-EG')}</div>
                <div><strong>حالة الدفع:</strong> <span className="text-green-600 font-semibold">مكتملة</span></div>
              </div>
              <div className="space-y-2">
                <div><strong>طريقة الدفع:</strong> {
                  paymentData.paymentMethod === 'card' ? 'بطاقة ائتمان/مدين' :
                  paymentData.paymentMethod === 'wallet' ? 'محفظة رقمية' :
                  paymentData.paymentMethod === 'installment' ? 'تقسيط' : 'غير محدد'
                }</div>
                <div><strong>رقم المرجع:</strong> REF{Math.random().toString().slice(2, 12)}</div>
                <div><strong>العملة:</strong> جنيه مصري (EGP)</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 mt-8 pt-6 text-center text-xs text-slate-500">
            <p className="mb-2">شكراً لك لاختيار منصة Fureraa لإنشاء مواقعك الإلكترونية</p>
            <p>هذه فاتورة مولدة إلكترونياً ولا تحتاج لختم أو توقيع</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <span>🔒 دفع آمن ومحمي</span>
              <span>✅ معتمد من بوابات الدفع</span>
              <span>📱 خدمة عملاء 24/7</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - No Print */}
        <div className="no-print flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={handlePrint}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all whitespace-nowrap"
          >
            <i className="ri-printer-line"></i>
            <span>طباعة الفاتورة</span>
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all whitespace-nowrap"
          >
            <i className="ri-download-line"></i>
            <span>تحميل PDF</span>
          </button>
          <button
            onClick={handleContinue}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all whitespace-nowrap"
          >
            <i className="ri-arrow-right-line"></i>
            <span>الانتقال للوحة التحكم</span>
          </button>
        </div>

        {/* Important Notes - No Print */}
        <div className="no-print mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <i className="ri-information-line text-blue-400 text-xl mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">معلومات مهمة</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• تم تفعيل اشتراكك بنجاح ويمكنك الآن استخدام جميع مميزات الخطة</li>
                <li>• سيتم إرسال نسخة من الفاتورة إلى بريدك الإلكتروني</li>
                <li>• يمكنك الوصول لجميع فواتيرك من لوحة التحكم في قسم "الفوترة"</li>
                <li>• في حالة وجود أي استفسار، تواصل معنا على info@fureraa.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
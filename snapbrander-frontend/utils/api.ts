import { toast } from 'react-hot-toast';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
}

export async function fetchApi(
  endpoint: string, 
  options: RequestInit = {}, 
  requiresAuth: boolean = true
): Promise<ApiResponse> {
  try {
    const baseUrl = 'http://localhost:8000';
    const url = `${baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (requiresAuth) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
    }
    
    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    toast.error(error.message || 'حدث خطأ في الاتصال بالخادم');
    return {
      success: false,
      message: error.message || 'حدث خطأ في الاتصال بالخادم',
    };
  }
}

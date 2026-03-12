import { supabase } from './supabase';

const ADMIN_TOKEN_KEY = 'admin_token';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      return { success: true, token: data.token };
    }

    return { success: false, error: data.error || 'Login failed' };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'X-Admin-Token': token
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function verifyAdminToken(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'X-Admin-Token': token
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.admin;
    }

    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return null;
  } catch (error) {
    return null;
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'X-Admin-Token': token || ''
  };
}

'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalBusinesses: number;
  totalMessages: number;
  businessesThisMonth: number;
  messagesThisMonth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    totalMessages: 0,
    businessesThisMonth: 0,
    messagesThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        { count: totalBusinesses },
        { count: totalMessages },
        { count: businessesThisMonth },
        { count: messagesThisMonth },
      ] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString()),
        supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString()),
      ]);

      setStats({
        totalBusinesses: totalBusinesses || 0,
        totalMessages: totalMessages || 0,
        businessesThisMonth: businessesThisMonth || 0,
        messagesThisMonth: messagesThisMonth || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Afaceri',
      value: stats.totalBusinesses,
      description: 'Afaceri înregistrate',
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Mesaje',
      value: stats.totalMessages,
      description: 'Mesaje primite',
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Afaceri Luna Aceasta',
      value: stats.businessesThisMonth,
      description: 'Adăugate în luna curentă',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
    {
      title: 'Mesaje Luna Aceasta',
      value: stats.messagesThisMonth,
      description: 'Primite în luna curentă',
      icon: Calendar,
      color: 'bg-gray-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Prezentare generală a platformei</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <div className={`${stat.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activitate Recentă</CardTitle>
              <CardDescription>
                Ultimele acțiuni pe platformă
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {stats.businessesThisMonth} afaceri noi
                    </p>
                    <p className="text-xs text-gray-500">În această lună</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {stats.messagesThisMonth} mesaje noi
                    </p>
                    <p className="text-xs text-gray-500">În această lună</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acțiuni Rapide</CardTitle>
              <CardDescription>
                Link-uri către funcții importante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="/admin/businesses"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-700 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gestionează Afaceri</p>
                      <p className="text-xs text-gray-500">Adaugă, editează sau șterge afaceri</p>
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/messages"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-700 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vezi Mesaje</p>
                      <p className="text-xs text-gray-500">Răspunde la întrebări și feedback</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    try {
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');

      if (error) {
        setError(`Database Error: ${error.message}`);
        console.error('Supabase error:', error);
      } else {
        setData(businesses);
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          {loading && <p className="text-gray-600">Testing connection...</p>}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {data && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800 font-semibold">
                ✓ Successfully connected to database
              </p>
              <p className="text-green-600 mt-2">
                Found {data.length} businesses
              </p>
            </div>
          )}
        </div>

        {data && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Database Records</h2>
            <div className="space-y-4">
              {data.map((business: any) => (
                <div
                  key={business.id}
                  className="border border-gray-200 rounded p-4"
                >
                  <h3 className="font-bold text-lg">{business.name}</h3>
                  <p className="text-gray-600">Category: {business.category}</p>
                  <p className="text-gray-600">Address: {business.address}</p>
                  <p className="text-gray-600">
                    Location: {business.plz} {business.city}
                  </p>
                  <p className="text-gray-600">Phone: {business.phone}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Slug: {business.slug}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>
              SUPABASE_URL:{' '}
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
              </span>
            </p>
            <p>
              SUPABASE_ANON_KEY:{' '}
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

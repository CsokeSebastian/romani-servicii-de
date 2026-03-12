'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { supabase, Business } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { useRouter } from 'next/navigation';

export function HeroSearch() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('category, city');

      if (businesses) {
        const categorySet = new Set(businesses.map((b: any) => b.category));
        const citySet = new Set(businesses.map((b: any) => b.city));
        const uniqueCategories = Array.from(categorySet).sort();
        const uniqueCities = Array.from(citySet).sort();
        setCategories(uniqueCategories);
        setCities(uniqueCities);
      }
    }

    fetchData();
  }, []);

  const handleSearch = () => {
    if (selectedCategory && selectedCity) {
      router.push(`/categorie/${generateSlug(selectedCategory)}/${generateSlug(selectedCity)}`);
    } else if (selectedCategory) {
      router.push(`/categorie/${generateSlug(selectedCategory)}`);
    } else if (selectedCity) {
      router.push(`/servicii?city=${selectedCity}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Servicii pentru Români în Germania
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Găsește rapid servicii oferite de români sau în limba română
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900"
              >
                <option value="">Toate categoriile</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oraș
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900"
              >
                <option value="">Toate orașele</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-gray-900 hover:bg-gray-800 h-[50px] text-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Caută
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

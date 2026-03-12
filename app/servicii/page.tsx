'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, Business, CITY_COORDINATES } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Search, Navigation } from 'lucide-react';
import Link from 'next/link';
import { calculateDistance, BusinessWithDistance } from '@/lib/distance';

export default function ServiciiPage() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<BusinessWithDistance[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get('city') || ''
  );
  const [radius, setRadius] = useState<number>(0);

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory, selectedCity, searchTerm, radius]);

  async function loadFilters() {
    const { data } = await supabase
      .from('businesses')
      .select('category, city');

    if (data) {
      const categorySet = new Set(data.map((b: any) => b.category));
      const citySet = new Set(data.map((b: any) => b.city));
      const uniqueCategories = Array.from(categorySet).sort();
      const uniqueCities = Array.from(citySet).sort();
      setCategories(uniqueCategories);
      setCities(uniqueCities);
    }
  }

  async function loadBusinesses() {
    setLoading(true);

    let query = supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
    }

    const { data } = await query;

    if (data) {
      let filteredData = data as BusinessWithDistance[];

      if (selectedCity && radius > 0) {
        const cityCoords = CITY_COORDINATES[selectedCity];
        if (cityCoords) {
          filteredData = filteredData
            .map((business) => {
              if (business.latitude && business.longitude) {
                const distance = calculateDistance(
                  cityCoords.lat,
                  cityCoords.lon,
                  business.latitude,
                  business.longitude
                );
                return { ...business, distance };
              }
              return business;
            })
            .filter((business) => !business.distance || business.distance <= radius)
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
      } else if (selectedCity) {
        filteredData = filteredData.filter((b) => b.city === selectedCity);
      }

      setBusinesses(filteredData);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Toate Serviciile</h1>
          <p className="text-gray-300">
            Găsește serviciile de care ai nevoie în comunitatea română
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Caută după nume..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            >
              <option value="">Toate categoriile</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            >
              <option value="">Toate orașele</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              disabled={!selectedCity}
            >
              <option value="0">Doar orașul selectat</option>
              <option value="10">În raza de 10 km</option>
              <option value="25">În raza de 25 km</option>
              <option value="50">În raza de 50 km</option>
            </select>
          </div>

          {selectedCity && radius > 0 && (
            <div className="flex items-center text-sm text-gray-900 bg-gray-100 px-4 py-2 rounded">
              <Navigation className="h-4 w-4 mr-2" />
              Căutare în raza de {radius} km față de {selectedCity}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Se încarcă...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nu s-au găsit servicii. Încearcă alt filtru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-xl">{business.name}</h3>
                    <Badge variant="secondary">{business.category}</Badge>
                  </div>
                  <div className="flex items-start text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{business.address}</div>
                      <div className="font-semibold">{business.plz} {business.city}</div>
                      {business.distance !== undefined && (
                        <div className="text-gray-900 font-medium mt-1">
                          <Navigation className="h-3 w-3 inline mr-1" />
                          {business.distance} km distanță
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${business.phone}`} className="hover:text-gray-900">
                        {business.phone}
                      </a>
                    </div>
                  </div>

                  <Link href={`/firma/${business.slug}`}>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                      Vezi profil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

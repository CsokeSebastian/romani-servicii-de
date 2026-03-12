'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import Link from 'next/link';
import {
  Scale,
  HardHat,
  Calculator,
  Scissors,
  Wrench,
  Stethoscope,
  Languages,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, any> = {
  'Avocați': Scale,
  'Constructori': HardHat,
  'Contabili': Calculator,
  'Dentiști': Stethoscope,
  'Frizerii': Scissors,
  'Mecanici Auto': Wrench,
  'Medici': Stethoscope,
  'Traducători': Languages,
  'Diverse': Briefcase,
};

type CategoryWithCount = {
  name: string;
  slug: string;
  count: number;
};

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const { data: businesses } = await supabase
      .from('businesses')
      .select('category');

    if (businesses) {
      const categoryCounts: Record<string, number> = {};

      businesses.forEach((b: any) => {
        if (b.category) {
          categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
        }
      });

      const categoryList = Object.keys(categoryCounts)
        .sort()
        .map(name => ({
          name,
          slug: generateSlug(name),
          count: categoryCounts[name],
        }));

      setCategories(categoryList);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi la pagina principală
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Toate Categoriile
          </h1>
          <p className="text-lg text-gray-600">
            Explorează toate serviciile disponibile pentru comunitatea română în Germania
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {categories.length} {categories.length === 1 ? 'categorie' : 'categorii'} disponibile
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Se încarcă categoriile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.name] || Briefcase;

              return (
                <Link key={category.slug} href={`/categorie/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-gray-900">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <Icon className="h-10 w-10 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.count} {category.count === 1 ? 'afacere' : 'afaceri'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nu s-au găsit categorii.</p>
          </div>
        )}
      </div>
    </div>
  );
}

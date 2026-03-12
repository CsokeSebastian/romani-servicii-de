'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase, Business } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Scale,
  HardHat,
  Calculator,
  Scissors,
  Wrench,
  Stethoscope,
  Languages,
  Briefcase,
} from 'lucide-react';

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

export function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('category');

    if (businesses) {
      const categoryCounts: Record<string, number> = {};

      businesses.forEach((b: any) => {
        categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
      });

      const categoryList = Object.keys(categoryCounts)
        .sort()
        .map(name => ({
          name,
          slug: generateSlug(name),
          count: categoryCounts[name],
        }));

      const shuffled = [...categoryList].sort(() => Math.random() - 0.5);
      const randomCategories = shuffled.slice(0, 8);

      setCategories(randomCategories);
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Categorii Populare
          </h2>
          <p className="text-lg text-gray-600">
            Explorează serviciile disponibile pentru comunitatea română
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.name] || Briefcase;

            return (
              <Link key={category.slug} href={`/categorie/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-gray-900">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Icon className="h-8 w-8 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.count} {category.count === 1 ? 'afacere' : 'afaceri'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/categorii">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              Vezi toate categoriile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

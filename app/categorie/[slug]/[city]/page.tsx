import { supabase, Business } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
  params: { slug: string; city: string };
};

async function getCategoryCityData(categorySlug: string, citySlug: string) {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name');

  if (error || !businesses) {
    return null;
  }

  const categorySet = new Set(businesses.map((b: Business) => b.category));
  const allCategories = Array.from(categorySet);
  const category = allCategories.find(cat => generateSlug(cat) === categorySlug);

  if (!category) {
    return null;
  }

  const citySet = new Set(businesses.map((b: Business) => b.city));
  const allCities = Array.from(citySet);
  const city = allCities.find(c => generateSlug(c) === citySlug);

  if (!city) {
    return null;
  }

  const filteredBusinesses = businesses.filter(
    (b: Business) => b.category === category && b.city === city
  );

  return {
    category,
    city,
    businesses: filteredBusinesses,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCategoryCityData(params.slug, params.city);

  if (!data) {
    return {
      title: 'Pagină negăsită',
    };
  }

  return {
    title: `${data.category} români în ${data.city} | Servicii pentru Români`,
    description: `Găsește ${data.category.toLowerCase()} români în ${data.city}. Director cu ${data.businesses.length} firme românești în ${data.city}.`,
    keywords: `${data.category.toLowerCase()} ${data.city}, ${data.category.toLowerCase()} romani ${data.city}, servicii ${data.category.toLowerCase()} ${data.city}`,
  };
}

export default async function CategoryCityPage({ params }: Props) {
  const data = await getCategoryCityData(params.slug, params.city);

  if (!data) {
    notFound();
  }

  const { category, city, businesses } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/categorie/${params.slug}`}
            className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la toate {category}
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            {category} în {city}
          </h1>
          <p className="text-xl text-gray-300">
            {businesses.length} {businesses.length === 1 ? 'afacere găsită' : 'afaceri găsite'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-xl">{business.name}</CardTitle>
                <div className="text-sm text-gray-500">{business.category}</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{business.address}</div>
                    <div className="font-semibold">{business.plz} {business.city}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${business.phone}`} className="text-gray-900 hover:underline">
                    {business.phone}
                  </a>
                </div>

                <Link href={`/firma/${business.slug}`}>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">
                    Vezi profil
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nu există afaceri în această categorie pentru orașul {city}.
            </p>
            <Link href={`/categorie/${params.slug}`} className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Vezi toate {category}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { supabase, Business } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

async function getCategoryData(slug: string) {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name');

  if (error) {
    console.error('Database error:', error);
    return null;
  }

  if (!businesses || businesses.length === 0) {
    console.error('No businesses found in database');
    return null;
  }

  const categorySet = new Set(businesses.map((b: Business) => b.category));
  const allCategories = Array.from(categorySet);
  const category = allCategories.find(cat => generateSlug(cat) === slug);

  if (!category) {
    console.error('Category not found for slug:', slug, 'Available categories:', allCategories);
    return null;
  }

  const categoryBusinesses = businesses.filter((b: Business) => b.category === category);
  const citySet = new Set(categoryBusinesses.map((b: Business) => b.city));
  const cities = Array.from(citySet).sort();

  return {
    category,
    businesses: categoryBusinesses,
    cities,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCategoryData(params.slug);

  if (!data) {
    return {
      title: 'Categorie negăsită',
    };
  }

  return {
    title: `${data.category} români în Germania | Servicii pentru Români`,
    description: `Găsește ${data.category.toLowerCase()} români în Germania. Director cu ${data.businesses.length} firme românești și servicii pentru români.`,
    keywords: `${data.category.toLowerCase()} romani Germania, ${data.category.toLowerCase()} in Germania, servicii ${data.category.toLowerCase()}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await getCategoryData(params.slug);

  if (!data) {
    notFound();
  }

  const { category, businesses, cities } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{category}</h1>
          <p className="text-xl text-gray-300">
            {businesses.length} {businesses.length === 1 ? 'afacere găsită' : 'afaceri găsite'} în Germania
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cities.length > 1 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Filtrează după oraș:</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/categorie/${params.slug}/${generateSlug(city)}`}
                >
                  <Button variant="outline" className="hover:bg-gray-100">
                    {city}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

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
            <p className="text-gray-500">Nu există afaceri în această categorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}

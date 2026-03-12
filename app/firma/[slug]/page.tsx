import { supabase, Business } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { generateSlug } from '@/lib/slug';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

async function getBusiness(slug: string) {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug);

  if (error) {
    console.error('Database error:', error);
    return null;
  }

  if (!businesses || businesses.length === 0) {
    console.error('Business not found for slug:', slug);
    return null;
  }

  return businesses[0] as Business;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusiness(params.slug);

  if (!business) {
    return {
      title: 'Firmă negăsită',
    };
  }

  return {
    title: `${business.name} | ${business.category} în ${business.city}`,
    description: `${business.name} oferă servicii de ${business.category.toLowerCase()} în ${business.city}. Vezi adresa, telefonul și detalii complete.`,
    keywords: `${business.name}, ${business.category.toLowerCase()} ${business.city}, ${business.category.toLowerCase()} romani, servicii ${business.city}`,
  };
}

export default async function BusinessPage({ params }: Props) {
  const business = await getBusiness(params.slug);

  if (!business) {
    notFound();
  }

  const categorySlug = generateSlug(business.category);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(
    `${business.address}, ${business.plz} ${business.city}, Germany`
  )}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      postalCode: business.plz,
      addressLocality: business.city,
      addressCountry: 'DE',
    },
    telephone: business.phone,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/categorie/${categorySlug}`}
              className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi la {business.category}
            </Link>
            <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
            <p className="text-xl text-gray-300">{business.category}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Despre această firmă</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {business.name} oferă servicii de {business.category.toLowerCase()} în {business.city} și
                    zonele din apropiere. Firmă românească care servește comunitatea română din Germania.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Locație</h2>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Locația ${business.name}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-bold text-lg mb-4">Informații de contact</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Adresă</div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{business.address}</div>
                          <div className="font-semibold text-gray-900">
                            {business.plz} {business.city}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Telefon</div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-gray-900 flex-shrink-0" />
                        <a
                          href={`tel:${business.phone}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Categorie</div>
                      <Link
                        href={`/categorie/${categorySlug}`}
                        className="inline-flex items-center text-gray-900 hover:underline"
                      >
                        {business.category}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <a href={`tel:${business.phone}`} className="block">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800">
                        <Phone className="mr-2 h-4 w-4" />
                        Sună acum
                      </Button>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${business.address}, ${business.plz} ${business.city}, Germany`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        Deschide în Maps
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Servicii Pentru Români în Germania',
    url: 'https://servicii-romani.de',
    logo: 'https://servicii-romani.de/logo.png',
    description: 'Directorul complet de servicii pentru comunitatea română din Germania',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
    },
    sameAs: [],
  };
}

export function getLocalBusinessStructuredData(business: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    telephone: business.phone,
    email: business.email,
    url: business.website,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street_address,
      addressLocality: business.city,
      postalCode: business.postal_code,
      addressCountry: 'DE',
    },
    geo: business.latitude && business.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    } : undefined,
    aggregateRating: business.rating ? {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.review_count || 1,
    } : undefined,
  };
}

export function getBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

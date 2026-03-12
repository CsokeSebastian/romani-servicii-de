import { HeroSearch } from '@/components/hero-search';
import { CategoriesSection } from '@/components/categories-section';
import { TrustSection } from '@/components/trust-section';

export default function Home() {
  return (
    <>
      <HeroSearch />
      <CategoriesSection />
      <TrustSection />
    </>
  );
}

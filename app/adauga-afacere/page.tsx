'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';

export default function AdaugaAfacerePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    plz: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from('businesses')
      .select('category');

    if (data) {
      const categorySet = new Set(data.map((b: any) => b.category));
      const uniqueCategories = Array.from(categorySet).sort();
      setCategories(uniqueCategories);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.category || !formData.address || !formData.plz || !formData.city || !formData.phone) {
      setError('Te rugăm să completezi toate câmpurile obligatorii.');
      setLoading(false);
      return;
    }

    const slug = generateSlug(formData.name);

    const { error: submitError } = await supabase
      .from('businesses')
      .insert({
        name: formData.name,
        category: formData.category,
        address: formData.address,
        plz: formData.plz,
        city: formData.city,
        phone: formData.phone,
        slug,
      });

    if (submitError) {
      setError('A apărut o eroare. Te rugăm să încerci din nou.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFormData({
      name: '',
      category: '',
      address: '',
      plz: '',
      city: '',
      phone: '',
    });
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Adaugă Afacerea Ta</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Mulțumim! Afacerea ta a fost adăugată cu succes.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informații Afacere</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">
                  Numele Afacerii <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Popescu Bau"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="">Selectează categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="address">
                  Adresă <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Ex: Hauptstraße 123"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plz">
                    PLZ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="plz"
                    type="text"
                    value={formData.plz}
                    onChange={(e) => handleChange('plz', e.target.value)}
                    placeholder="Ex: 80331"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">
                    Oraș <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Ex: München"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">
                  Telefon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+49 89 12345678"
                  required
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  <strong>Important:</strong> Afacerile vor fi verificate și apoi postate.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 h-12 text-lg"
              >
                {loading ? 'Se trimite...' : 'Adaugă Afacerea'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Ai întrebări? Contactează-ne la{' '}
            <a href="mailto:contact@serviciipentruromani.de" className="text-gray-900 hover:underline">
              contact@serviciipentruromani.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

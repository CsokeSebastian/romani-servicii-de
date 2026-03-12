'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, CITY_COORDINATES } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';
import { Upload, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n');
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      values.push(current.trim());
      return values;
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      // First, clear existing data
      await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const text = await file.text();
      const rows = parseCSV(text);

      const header = rows[0];
      const data = rows.slice(1).filter(row => row.length >= 6 && row[0]);

      let success = 0;
      let failed = 0;

      for (const row of data) {
        const [name, category, address, plz, city, phone] = row;

        if (!name || !category || !city) {
          failed++;
          continue;
        }

        const slug = generateSlug(name);
        const cityCoords = CITY_COORDINATES[city.trim()] || CITY_COORDINATES['München'];

        const { error: insertError } = await supabase
          .from('businesses')
          .insert({
            name: name.trim(),
            category: category.trim(),
            address: address.trim() || '',
            plz: plz.trim() || '',
            city: city.trim(),
            phone: phone.trim() || '',
            slug,
            latitude: cityCoords.lat,
            longitude: cityCoords.lon,
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          failed++;
        } else {
          success++;
        }
      }

      setResult({ success, failed });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-6 w-6" />
              <span>Importă Afaceri din CSV</span>
            </CardTitle>
            <CardDescription>
              Încarcă un fișier CSV cu coloanele: Name, Category, Address, PLZ, City, Phone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Fișier CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={importing}
              />
              <p className="text-sm text-gray-500">
                Formatul așteptat: Name, Category, Address, PLZ, City, Phone
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Exemplu format CSV:</h4>
              <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-x-auto">
{`Name,Category,Address,PLZ,City,Phone
Popescu Bau,Constructori,Hauptstraße 123,80331,München,+49 89 12345678
Cabinet Avocat Ionescu,Avocați,Berliner Allee 45,10115,Berlin,+49 30 98765432`}
              </pre>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {importing ? 'Se importă...' : 'Importă Date'}
            </Button>

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Import finalizat!</h4>
                    <p className="text-sm text-green-700">
                      {result.success} afaceri importate cu succes
                      {result.failed > 0 && `, ${result.failed} eșuate`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Eroare</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

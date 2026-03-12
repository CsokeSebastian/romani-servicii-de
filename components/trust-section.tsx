import { Shield, Users, CircleCheck as CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            De ce să ne alegi?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platforma ajută românii din Germania să găsească servicii oferite de români sau în limba română
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Afaceri Verificate</h3>
              <p className="text-gray-600">
                Toate afacerile sunt verificate înainte de a fi listate pe platformă
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-8 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Comunitate Română</h3>
              <p className="text-gray-600">
                Conectăm comunitatea română din Germania cu servicii de încredere
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-8 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Ușor de Utilizat</h3>
              <p className="text-gray-600">
                Găsește rapid serviciile de care ai nevoie cu câteva click-uri
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

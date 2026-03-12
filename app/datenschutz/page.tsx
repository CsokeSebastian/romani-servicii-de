import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
          <p className="text-gray-600">
            Informationen zum Datenschutz gemäß DSGVO
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>
            <p>
              Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
              werden können.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Verantwortliche Stelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-700">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-medium">Sebastian Csöke</p>
              <p className="mt-2">
                <span className="font-medium">E-Mail:</span>{' '}
                <a href="mailto:contact@serviciipentruromani.com" className="text-blue-600 hover:text-blue-800">
                  contact@serviciipentruromani.com
                </a>
              </p>
              <p>
                <span className="font-medium">Website:</span>{' '}
                <a href="https://www.serviciipentruromani.com" className="text-blue-600 hover:text-blue-800">
                  www.serviciipentruromani.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Datenerfassung auf dieser Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus
                dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung
                der Anfrage gespeichert.
              </p>
              <p className="mt-2">
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Server-Log-Dateien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
            </p>
            <p>Dies sind:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mt-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Unsere Website verwendet teilweise sogenannte Cookies.
            </p>
            <p>
              Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren.
            </p>
            <p>
              Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Ihre Rechte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
              <li>die Berichtigung Ihrer Daten zu verlangen</li>
              <li>die Löschung Ihrer Daten zu verlangen</li>
              <li>die Einschränkung der Verarbeitung zu verlangen</li>
            </ul>
            <p className="mt-4">
              Hierzu können Sie sich jederzeit unter der im Impressum angegebenen E-Mail-Adresse
              an uns wenden.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Haftung für Einträge im Verzeichnis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Diese Website stellt ein öffentliches Verzeichnis dar, in dem Unternehmen und
              Dienstleister gelistet werden können.
            </p>
            <p>
              Die auf dieser Website veröffentlichten Einträge stammen teilweise aus öffentlich
              zugänglichen Quellen oder wurden von den jeweiligen Unternehmen selbst zur Veröffentlichung
              bereitgestellt.
            </p>
            <p>
              Wir übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der
              veröffentlichten Informationen.
            </p>
            <p>
              Die Verantwortung für die Inhalte der einzelnen Einträge liegt bei den jeweiligen
              Unternehmen oder Dienstleistern.
            </p>
            <p>
              Sollten Sie der Meinung sein, dass ein Eintrag falsche Informationen enthält oder
              Rechte verletzt, kontaktieren Sie uns bitte, damit wir den entsprechenden Eintrag
              prüfen und gegebenenfalls korrigieren oder entfernen können.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recht auf Löschung von Daten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Wenn Sie Eigentümer eines Unternehmens sind, das in unserem Verzeichnis gelistet ist,
              haben Sie das Recht, die Änderung oder Löschung der entsprechenden Daten zu verlangen.
            </p>
            <p>
              Wenn Sie möchten, dass Ihre Daten korrigiert oder vollständig aus unserem Verzeichnis
              entfernt werden, kontaktieren Sie uns bitte unter folgender E-Mail-Adresse:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <a href="mailto:contact@serviciipentruromani.com" className="text-blue-600 hover:text-blue-800 font-medium">
                contact@serviciipentruromani.com
              </a>
            </div>
            <p>
              Nach Überprüfung Ihrer Anfrage werden wir die entsprechenden Daten so schnell wie
              möglich aktualisieren oder löschen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

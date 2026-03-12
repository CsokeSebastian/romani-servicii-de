import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CITY_COORDINATES = {
  'München': { lat: 48.1351, lon: 11.5820 },
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'Berlin-Charlottenburg': { lat: 52.5200, lon: 13.4050 },
  'Berlin.': { lat: 52.5200, lon: 13.4050 },
  'Berlin-Wilmersdorf': { lat: 52.5200, lon: 13.4050 },
  'Frankfurt am Main': { lat: 50.1109, lon: 8.6821 },
  '60311, Frankfurt': { lat: 50.1109, lon: 8.6821 },
  'Düsseldorf': { lat: 51.2277, lon: 6.7735 },
  'Hamburg': { lat: 53.5511, lon: 9.9937 },
  'Köln': { lat: 50.9375, lon: 6.9603 },
  'Stuttgart': { lat: 48.7758, lon: 9.1829 },
  'Stuttgart Wangen': { lat: 48.7758, lon: 9.1829 },
  'Dortmund': { lat: 51.5136, lon: 7.4653 },
  'Nürnberg': { lat: 49.4521, lon: 11.0767 },
  'nurnberg': { lat: 49.4521, lon: 11.0767 },
  'Augsburg': { lat: 48.3705, lon: 10.8978 },
  'Mannheim': { lat: 49.4875, lon: 8.4660 },
  'Mannheim-Ludwigsvorstadt-Isarvorstadt': { lat: 49.4875, lon: 8.4660 },
  'Karlsruhe': { lat: 49.0069, lon: 8.4037 },
  'Bonn': { lat: 50.7374, lon: 7.0982 },
  'Wiesbaden': { lat: 50.0825, lon: 8.2400 },
  'Bremen': { lat: 53.0793, lon: 8.8017 },
  'Hannover': { lat: 52.3759, lon: 9.7320 },
  'Freiburg': { lat: 47.9990, lon: 7.8421 },
  'Heidelberg': { lat: 49.3988, lon: 8.6724 },
  'Mainz': { lat: 50.0000, lon: 8.2711 },
  'Saarbrücken': { lat: 49.2401, lon: 6.9969 },
  'Saarbrücken – Burbach': { lat: 49.2401, lon: 6.9969 },
  'Offenbach am Main': { lat: 50.1006, lon: 8.7761 },
  'Offenbach am Main Deutschland': { lat: 50.1006, lon: 8.7761 },
  'Ludwigshafen': { lat: 49.4816, lon: 8.4353 },
  'Heilbronn': { lat: 49.1427, lon: 9.2109 },
  'Chemnitz': { lat: 50.8279, lon: 12.9214 },
  'Aachen': { lat: 50.7753, lon: 6.0839 },
  'Bielefeld': { lat: 52.0302, lon: 8.5325 },
  'Bielefeld-Brackwede': { lat: 52.0302, lon: 8.5325 },
  'Kassel': { lat: 51.3127, lon: 9.4797 },
  'Kassel-Mitte': { lat: 51.3127, lon: 9.4797 },
  'Potsdam': { lat: 52.3988, lon: 13.0656 },
  'Regensburg': { lat: 49.0134, lon: 12.1016 },
  'Würzburg': { lat: 49.7913, lon: 9.9534 },
  'Erlangen': { lat: 49.5897, lon: 11.0089 },
  'Ingolstadt': { lat: 48.7665, lon: 11.4257 },
  'Konstanz': { lat: 47.6633, lon: 9.1753 },
  'Koblenz': { lat: 50.3569, lon: 7.5890 },
  'Gelsenkirchen': { lat: 51.5177, lon: 7.0857 },
  'Osnabrück': { lat: 52.2799, lon: 8.0472 },
  'Bruchsal': { lat: 49.1247, lon: 8.5976 },
  'Sindelfingen': { lat: 48.7099, lon: 9.0002 },
  'Pfinztal': { lat: 48.9589, lon: 8.5464 },
  'Speyer': { lat: 49.3197, lon: 8.4312 },
  'Worms': { lat: 49.6333, lon: 8.3667 },
  'Straubing': { lat: 48.8807, lon: 12.5683 },
  'Siegen': { lat: 50.8748, lon: 8.0243 },
  'Gerlingen': { lat: 48.7993, lon: 9.0621 },
  'Wegberg': { lat: 51.1411, lon: 6.2792 },
  'Rastatt': { lat: 48.8584, lon: 8.2054 },
  'Rastatt (Rauental)': { lat: 48.8584, lon: 8.2054 },
  'Hildesheim': { lat: 52.1502, lon: 9.9512 },
  'Rheine': { lat: 52.2784, lon: 7.4395 },
  'Preetz': { lat: 54.2369, lon: 10.2803 },
  'Schramberg': { lat: 48.2234, lon: 8.3861 },
  'Frankenthal': { lat: 49.5347, lon: 8.3553 },
  'Rohr in Niederbayern': { lat: 48.5833, lon: 12.1167 },
  'Ortenburg': { lat: 48.5500, lon: 13.2167 },
  'Leverkusen': { lat: 51.0333, lon: 6.9833 },
  'Viersen': { lat: 51.2558, lon: 6.3964 },
  'Wiesloch': { lat: 49.2948, lon: 8.6986 },
  'Limbach-Oberfrohna': { lat: 50.8583, lon: 12.7611 },
  'Lippstadt': { lat: 51.6667, lon: 8.3500 },
  'Andernach': { lat: 50.4389, lon: 7.4011 },
  'Schwabach': { lat: 49.3292, lon: 11.0244 },
  'Singen Hohentwiel': { lat: 47.7597, lon: 8.8408 },
  'Lingen (Ems)': { lat: 52.5225, lon: 7.3169 },
  'Bad Steben': { lat: 50.3586, lon: 11.6569 },
  'Bergisch Gladbach': { lat: 50.9922, lon: 7.1300 },
  'Peine': { lat: 52.3206, lon: 10.2369 },
  'Erbach': { lat: 49.6583, lon: 8.9947 },
  'Müssen': { lat: 53.5500, lon: 10.8667 },
  'Deggendorf': { lat: 48.8333, lon: 12.9667 },
  'Crailsheim': { lat: 49.1333, lon: 10.0667 },
  'Neckarsulm': { lat: 49.1897, lon: 9.2275 },
  'Bad Neustadt': { lat: 50.3167, lon: 10.2167 },
  'Zorneding': { lat: 48.0806, lon: 11.8264 },
  'Erlenbach': { lat: 49.8000, lon: 9.1500 },
  'Bröckel': { lat: 52.6167, lon: 10.2333 },
  'Eching': { lat: 48.3000, lon: 11.6167 },
  'Neubiberg': { lat: 48.0764, lon: 11.6636 },
  'Piding': { lat: 47.7333, lon: 12.9000 },
  'Leuna': { lat: 51.3167, lon: 12.0167 },
  'Altdorf': { lat: 49.3856, lon: 11.3553 },
  'Schweinfurt': { lat: 50.0500, lon: 10.2333 },
  'Hammelburg': { lat: 50.1167, lon: 9.9000 },
  'Laufach': { lat: 50.0000, lon: 9.2833 },
  'Niederwiesa': { lat: 50.8833, lon: 13.0333 },
  'Heinsberg-Unterbruch': { lat: 51.0611, lon: 6.0972 },
  'Geilenkirchen': { lat: 50.9678, lon: 6.1181 },
  'Salzgitter': { lat: 52.1500, lon: 10.3333 },
  'Mühlheim': { lat: 48.0500, lon: 8.9000 },
  'Krauchenwies': { lat: 48.0244, lon: 9.2689 },
  'Dornhan': { lat: 48.3500, lon: 8.5000 },
  'Eppelheim': { lat: 49.4006, lon: 8.6336 },
  'Geretsried': { lat: 47.8667, lon: 11.4667 },
  'Birkenfeld': { lat: 49.6500, lon: 7.1667 },
  'Ludwigsburg': { lat: 48.8944, lon: 9.1917 },
  'Waghäusel': { lat: 49.2500, lon: 8.5167 },
  'Calw': { lat: 48.7142, lon: 8.7386 },
  'Waldbronn': { lat: 48.9267, lon: 8.4567 },
  'Wartenberg': { lat: 48.4056, lon: 11.9917 },
  'Schwörstadt': { lat: 47.6114, lon: 7.8422 },
  'Monheim am Rhein': { lat: 51.0878, lon: 6.8856 },
  'Schwäbisch Gmünd': { lat: 48.8000, lon: 9.8000 },
  'Schmitten': { lat: 50.2667, lon: 8.4500 },
  '- Remseck': { lat: 48.8750, lon: 9.2750 },
  'Vaihingen an der Enz': { lat: 48.9333, lon: 8.9500 },
  'Ostfildern': { lat: 48.7250, lon: 9.2500 },
  'Ingelheim am Rhein': { lat: 49.9667, lon: 8.0667 },
  'Apelern': { lat: 52.2833, lon: 9.1667 },
  'Târgu Mureș': { lat: 46.5397, lon: 24.5586 },
  'remote': { lat: 48.1351, lon: 11.5820 },
};

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSV(text) {
  const lines = text.split('\n');
  return lines.map(line => {
    const values = [];
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
}

async function importData() {
  console.log('Starting import...');

  // Clear existing data
  console.log('Clearing existing data...');
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const csvContent = fs.readFileSync('full_directory.csv', 'utf-8');
  const rows = parseCSV(csvContent);

  const header = rows[0];
  const data = rows.slice(1).filter(row => row.length >= 6 && row[0]);

  console.log(`Found ${data.length} rows to import`);

  let success = 0;
  let failed = 0;
  const failedRecords = [];

  for (const row of data) {
    const [name, category, address, plz, city, phone] = row;

    if (!name || !category || !city) {
      failed++;
      continue;
    }

    const cleanCity = city.trim();
    const slug = generateSlug(name);
    const cityCoords = CITY_COORDINATES[cleanCity] || CITY_COORDINATES['München'];

    const { error: insertError } = await supabase
      .from('businesses')
      .insert({
        name: name.trim(),
        category: category.trim(),
        address: address ? address.trim() : '',
        plz: plz ? plz.trim() : '',
        city: cleanCity,
        phone: phone ? phone.trim() : '',
        slug,
        latitude: cityCoords.lat,
        longitude: cityCoords.lon,
      });

    if (insertError) {
      console.error(`Failed to insert ${name}:`, insertError.message);
      failedRecords.push({ name, error: insertError.message });
      failed++;
    } else {
      success++;
      if (success % 10 === 0) {
        console.log(`Imported ${success} businesses...`);
      }
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);

  if (failedRecords.length > 0) {
    console.log('\nFailed records:');
    failedRecords.forEach(({ name, error }) => {
      console.log(`- ${name}: ${error}`);
    });
  }
}

importData().catch(console.error);

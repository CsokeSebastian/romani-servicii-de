const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvContent = fs.readFileSync(path.join(__dirname, '../sample_businesses.csv'), 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Find column indexes
const nameIdx = 0; // Name
const categoryIdx = 1; // Category
const addressIdx = 2; // Address
const plzIdx = 3; // PLZ
const cityIdx = 4; // City
const phoneIdx = 5; // Phone

const businesses = [];

// Process each line (skip header)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Simple CSV parsing (handling quoted fields)
  const fields = [];
  let currentField = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField.trim());

  const name = fields[nameIdx] || '';
  const category = fields[categoryIdx] || '';
  const address = fields[addressIdx] || '';
  const plz = fields[plzIdx] || '';
  const city = fields[cityIdx] || '';
  const phone = fields[phoneIdx] || '';

  // Skip if missing critical data
  if (!name || !category || !city) continue;

  businesses.push({
    name,
    category,
    address,
    plz,
    city,
    phone
  });
}

console.log(`Parsed ${businesses.length} businesses from CSV`);
console.log(JSON.stringify(businesses, null, 2));

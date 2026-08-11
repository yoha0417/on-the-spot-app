import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

interface PlaceCsvRow {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

const csvFilePath = path.resolve(__dirname, '../docs/新宿区公園一覧.csv');

function main() {
  const raw = fs.readFileSync(csvFilePath, 'utf-8');

  const parsed = Papa.parse<PlaceCsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data;

  for (const row of rows) {
    const name = String(row.name).trim();
    const address = String(row.address ?? '').trim();
    const lat = String(row.latitude ?? '').trim();
    const lng = String(row.longitude ?? '').trim();

    if (!name || !lat || !lng) {
      console.warn(`スキップ: name/lat/lng が空の行があります → ${JSON.stringify(row)}`);
      continue;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      console.warn(`スキップ: 経緯度が数値でない行 → ${JSON.stringify(row)}`);
      continue;
    }

    const escapedName = name.replace(/'/g, "''");
    const escapedAddress = address.replace(/'/g, "''");

    const sql = `INSERT OR IGNORE INTO places (name, address, latitude, longitude) VALUES ('${escapedName}', '${escapedAddress}', ${latNum}, ${lngNum});`;
    console.log(sql);
  }
}

main();

import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

// ------------------------------------------------------------------
// 簡易 CSV パーサー（外部ライブラリを使わずにカンマ区切り・引用符を処理）
// ------------------------------------------------------------------

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // ダブルクォート内の "" はエスケープされた引用符
        if (i + 1 < line.length && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(field.trim());
        field = '';
      } else {
        field += ch;
      }
    }
  }

  fields.push(field.trim());
  return fields;
}

function splitLines(raw: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (inQuotes) {
      // 引用符内では改行もそのまま取り込む
      if (ch === '"') {
        if (i + 1 < raw.length && raw[i + 1] === '"') {
          current += '""';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '\n') {
        result.push(current);
        current = '';
      } else if (ch === '\r') {
        // CRLF を正規化
        if (i + 1 < raw.length && raw[i + 1] === '\n') {
          i++; // \n を飛ばす
        }
        result.push(current);
        current = '';
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else {
          current += ch;
        }
      }
    }
  }

  result.push(current);
  return result;
}

function parseCsv(raw: string): Record<string, string>[] {
  const lines = splitLines(raw);
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = (fields[idx] ?? '').trim();
    });
    rows.push(row);
  }

  return rows;
}

// ------------------------------------------------------------------
// メイン処理
// ------------------------------------------------------------------

const csvFilePath = path.resolve(__dirname, '../docs/新宿区公園一覧.csv');

function main(): void {
  const dbPath = path.resolve(__dirname, '../assets/places.db');
  const db = new Database(dbPath);

  // テーブル作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
  `);

  const raw = fs.readFileSync(csvFilePath, 'utf-8');
  const rows = parseCsv(raw);

  const insertStmt = db.prepare(
    `INSERT OR IGNORE INTO places (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`
  );

  const insertMany = db.transaction((records: Record<string, string>[]) => {
    for (const row of records) {
      const name = String(row['公園名'] ?? row.name ?? '').trim();
      const address = String(row['住所'] ?? row.address ?? '').trim();
      const lat = String(row['緯度'] ?? row.latitude ?? '').trim();
      const lng = String(row['経度'] ?? row.longitude ?? '').trim();

      if (!name || !lat || !lng) {
        console.warn(`スキップ: 必須項目不足 → ${JSON.stringify(row)}`);
        continue;
      }

      const latNum = Number(lat);
      const lngNum = Number(lng);
      if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        console.warn(`スキップ: 緯度/経度が数値でない → ${JSON.stringify(row)}`);
        continue;
      }

      insertStmt.run(name, address, latNum, lngNum);
    }
  });

  insertMany(rows);
  console.log(`データベースに ${rows.length} 件の処理を完了しました。`);
  db.close();
}

main();

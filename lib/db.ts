import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

const DB_KEY = 'plates_db';

// Helper: Convert Uint8Array to Base64 string
function bufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 string to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Initialize the database
export const initDB = async (): Promise<Database> => {
  if (db) return db;

  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `/sql-wasm.wasm`, // Adjust path if needed (e.g., public/sql-wasm.wasm)
    });
  }

  const savedData = localStorage.getItem(DB_KEY);
  if (savedData) {
    try {
      const buffer = base64ToBuffer(savedData);
      db = new SQL.Database(buffer);
    } catch (e) {
      console.error('Failed to load saved database, creating new one', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS plates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL,
      type TEXT NOT NULL,
      state TEXT NOT NULL,
      createdAt INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

  return db;
};

// Save the database to localStorage
const saveDB = () => {
  if (!db) return;
  const data = db.export();
  const base64 = bufferToBase64(data);
  localStorage.setItem(DB_KEY, base64);
};

export interface Plate {
  id: number;
  number: string;
  type: 'Standard' | 'Taxi' | 'EV' | 'Diplomatic';
  state: string;
  createdAt: number;
}

// Add a new plate
export const addPlate = async (plate: Omit<Plate, 'id' | 'createdAt'>): Promise<void> => {
  const db = await initDB();
  db.run('INSERT INTO plates (number, type, state) VALUES (?, ?, ?)', [plate.number, plate.type, plate.state]);
  saveDB();
};

// Get all plates
export const getPlates = async (): Promise<Plate[]> => {
  const db = await initDB();
  const result = db.exec('SELECT * FROM plates ORDER BY createdAt DESC');

  if (result.length === 0) return [];

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map((row) => {
    const plate: any = {};
    columns.forEach((col, index) => {
      plate[col] = row[index];
    });
    return plate as Plate;
  });
};

// Get a single plate by ID
export const getPlate = async (id: number): Promise<Plate | null> => {
  const db = await initDB();
  const result = db.exec('SELECT * FROM plates WHERE id = ?', [id]);

  if (result.length === 0 || result[0].values.length === 0) return null;

  const columns = result[0].columns;
  const row = result[0].values[0];

  const plate: any = {};
  columns.forEach((col, index) => {
    plate[col] = row[index];
  });

  return plate as Plate;
};

// Delete a plate
export const deletePlate = async (id: number): Promise<void> => {
  const db = await initDB();
  db.run('DELETE FROM plates WHERE id = ?', [id]);
  saveDB();
};

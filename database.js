const path = require('path');
const Database = require('better-sqlite3');

// 1. Inicializa y configura la base de datos en un solo lugar.
const db = new Database(path.join('data', 'tips.db'));

// 2. Función para asegurar que la tabla y los índices existan.
function setupDatabase() {
  const createTableStmt = `
    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number TEXT NOT NULL,
      waiter_name TEXT NOT NULL,
      tip_percentage INTEGER NOT NULL,
      user_agent TEXT,
      device_id TEXT,
      created_at TEXT NOT NULL
    );
  `;
  db.exec(createTableStmt);
  db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON tips (created_at);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_waiter_name ON tips (waiter_name);');
  console.log('Base de datos conectada y tabla "tips" asegurada.');
}

// 3. Función para obtener registros de propinas con filtros.
function getTips({ startDate, endDate, waiterName } = {}) {
  let query = 'SELECT * FROM tips';
  const params = [];

  if (startDate || endDate || waiterName) {
    query += ' WHERE 1=1';
    if (startDate) {
      query += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      // Se incluye T23:59:59.999Z para cubrir el día completo
      query += ' AND created_at <= ?';
      params.push(endDate + 'T23:59:59.999Z');
    }
    if (waiterName) {
      query += ' AND waiter_name LIKE ?';
      params.push(`%${waiterName}%`);
    }
  }
  
  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(params);
}

// 4. Función para añadir un nuevo registro de propina.
function addTip(tipData) {
  const { table_number, waiter_name, tip_percentage, user_agent, device_id, created_at } = tipData;
  const stmt = db.prepare(
    'INSERT INTO tips (table_number, waiter_name, tip_percentage, user_agent, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(table_number, waiter_name, tip_percentage, user_agent, device_id, created_at);
  return { id: info.lastInsertRowid };
}

// 5. Se exportan las funciones para que server.js pueda usarlas.
module.exports = {
  setupDatabase,
  getTips,
  addTip
};
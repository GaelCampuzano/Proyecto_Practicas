// 1. Importación de módulos
require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const basicAuth = require('basic-auth');

// 2. Inicialización de la aplicación y configuración
const app = express();
const port = process.env.PORT || 3000;
const db = new Database(path.join('data', 'tips.db'));

// 3. Middlewares
app.use(express.json()); // Para poder entender los JSON que envía el frontend
app.use(express.static('public')); // Para servir los archivos estáticos (HTML, CSS, JS del kiosco)

// 4. Configuración de la Base de Datos
// Se ejecuta una sola vez al iniciar y se crea la tabla si no existe.
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

// Creación de índices para mejorar la velocidad de las consultas
db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON tips (created_at);');
db.exec('CREATE INDEX IF NOT EXISTS idx_waiter_name ON tips (waiter_name);');

console.log('Base de datos conectada y tabla "tips" asegurada.');

// 5. Middleware de Autenticación
const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== process.env.ADMIN_USER || user.pass !== process.env.ADMIN_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }
  next();
};

// 6. Definición de Rutas de la API

// --- Endpoint para CREAR un registro de propina (Público) ---
app.post('/api/tips', (req, res) => {
  try {
    const { table_number, waiter_name, tip_percentage, device_id } = req.body;

    // Validación básica de datos
    if (!table_number || !waiter_name || !tip_percentage) {
      return res.status(400).json({ error: 'Faltan datos requeridos: table_number, waiter_name, tip_percentage.' });
    }
    if (![20, 23, 25].includes(tip_percentage)) {
        return res.status(400).json({ error: 'Porcentaje de propina no válido. Solo se aceptan 20, 23, o 25.' });
    }

    const created_at = new Date().toISOString();
    const user_agent = req.headers['user-agent'];

    const stmt = db.prepare('INSERT INTO tips (table_number, waiter_name, tip_percentage, user_agent, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(table_number, waiter_name, tip_percentage, user_agent, device_id, created_at);

    res.status(201).json({ id: info.lastInsertRowid, message: 'Propina registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar propina:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Endpoint para LEER registros de propina (Protegido) ---
app.get('/api/tips', auth, (req, res) => {
  try {
    const { startDate, endDate, waiterName } = req.query;
    let query = 'SELECT * FROM tips';
    const params = [];

    // Lógica de filtros
    if (startDate || endDate || waiterName) {
      query += ' WHERE 1=1'; // Comodín para añadir filtros con AND
      if (startDate) {
        query += ' AND created_at >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND created_at <= ?';
        params.push(endDate + '23:59:59.999Z'); // Incluir todo el día final
      }
      if (waiterName) {
        query += ' AND waiter_name LIKE ?';
        params.push(`%${waiterName}%`);
      }
    }
    
    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const tips = stmt.all(params);
    res.status(200).json(tips);
  } catch (error) {
    console.error('Error al consultar propinas:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


// 7. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log('¡El Kiosco está en línea!');
  console.log(`Dashboard disponible en http://localhost:${port}/admin.html`);
});

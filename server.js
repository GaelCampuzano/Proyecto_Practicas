// 1. Importación de módulos
require('dotenv').config();
const express = require('express');
const basicAuth = require('basic-auth');
const db = require('./database.js'); // Importamos nuestro módulo de base de datos

// 2. Inicialización y configuración
const app = express();
const port = process.env.PORT || 3000;

// 3. Middlewares
app.use(express.json());
app.use(express.static('public'));

// 4. Configuración de la Base de Datos (ahora solo llamamos a la función)
db.setupDatabase();

// 5. Middleware de Autenticación (sin cambios)
const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== process.env.ADMIN_USER || user.pass !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }
  next();
};

// 6. Rutas de la API (ahora más limpias)

// --- Endpoint para CREAR un registro (Público) ---
app.post('/api/tips', (req, res) => {
  try {
    const { table_number, waiter_name, tip_percentage, device_id } = req.body;

    // Validación de datos
    if (!table_number || !waiter_name || !tip_percentage) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    if (![20, 23, 25].includes(tip_percentage)) {
      return res.status(400).json({ error: 'Porcentaje de propina no válido.' });
    }
    
    // Usamos la función de nuestro módulo
    const result = db.addTip({
      ...req.body,
      user_agent: req.headers['user-agent'],
      created_at: new Date().toISOString()
    });

    res.status(201).json({ id: result.id, message: 'Propina registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar propina:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Endpoint para LEER registros (Protegido) ---
app.get('/api/tips', auth, (req, res) => {
  try {
    // Los filtros se pasan directamente a nuestra función
    const tips = db.getTips(req.query);
    res.status(200).json(tips);
  } catch (error) {
    console.error('Error al consultar propinas:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


// 7. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Dashboard disponible en http://localhost:${port}/admin.html`);
});
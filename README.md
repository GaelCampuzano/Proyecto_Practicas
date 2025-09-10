# Kiosco de Propinas - Sunset Monalisa

Sistema de kiosco digital para la recolección de propinas en el restaurante Sunset Monalisa.

## Características Principales

- **Interfaz de Kiosco Intuitiva**: Sistema de 3 pantallas para el flujo completo de propinas
- **Base de Datos SQLite**: Almacenamiento local y eficiente de registros
- **API REST**: Endpoints para crear y consultar propinas
- **Autenticación Básica**: Panel de administración protegido
- **Responsive Design**: Optimizado para dispositivos táctiles
- **Validación de Datos**: Control de porcentajes permitidos (20%, 23%, 25%)

## Flujo de Usuario

1. **Pantalla del Mesero**: Ingreso de nombre y número de mesa
2. **Pantalla del Cliente**: Selección de porcentaje de propina
3. **Pantalla de Confirmación**: Animación de éxito y agradecimiento

## Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite3 (better-sqlite3)
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Autenticación**: Basic Auth
- **Estilos**: CSS Variables + Montserrat Font

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd kiosco-sunset

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de administrador

# Iniciar el servidor
npm start
```

## Configuración

Crear archivo `.env` con las siguientes variables:

```env
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=tu_password_seguro
```

## Uso

### Kiosco Principal
- Acceder a `http://localhost:3000`
- Seguir el flujo de 3 pantallas
- Las propinas se registran automáticamente

### Panel de Administración
- Acceder a `http://localhost:3000/admin.html`
- Usar credenciales configuradas en `.env`
- Consultar y filtrar registros de propinas

## API Endpoints

### POST /api/tips
Registra una nueva propina (público)

**Body:**
```json
{
  "table_number": "5",
  "waiter_name": "Gael Campuzano",
  "tip_percentage": 23,
  "device_id": "kiosk-1234567890"
}
```

### GET /api/tips
Consulta propinas (requiere autenticación)

**Query Parameters:**
- `startDate`: Fecha de inicio (ISO format)
- `endDate`: Fecha de fin (ISO format)
- `waiterName`: Nombre del mesero (búsqueda parcial)

## Estructura de Base de Datos

```sql
CREATE TABLE tips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_number TEXT NOT NULL,
  waiter_name TEXT NOT NULL,
  tip_percentage INTEGER NOT NULL,
  user_agent TEXT,
  device_id TEXT,
  created_at TEXT NOT NULL
);
```

## Personalización

### Colores
Modificar las variables CSS en `public/style.css`:
```css
:root {
  --primary-color: #ff8c00;    /* Color principal */
  --secondary-color: #4a4a4a;  /* Color de texto */
  --background-color: #f4f4f9; /* Color de fondo */
}
```

### Porcentajes de Propina
Modificar en `server.js` línea 59:
```javascript
if (![20, 23, 25].includes(tip_percentage)) {
}
```

## Scripts Disponibles

- `npm start`: Inicia el servidor en producción
- `npm run dev`: Inicia el servidor con auto-reload

## Estructura del Proyecto

```
kiosco-sunset/
├── data/
│   └── tips.db              # Base de datos SQLite
├── public/
│   ├── index.html           # Interfaz principal del kiosco
│   ├── app.js              # Lógica del frontend
│   ├── style.css           # Estilos principales
│   ├── admin.html          # Panel de administración
│   ├── admin.js            # Lógica del panel admin
│   └── admin.css           # Estilos del panel admin
├── server.js               # Servidor Express y API
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## Consideraciones de Seguridad

- Las credenciales de administrador deben ser seguras
- El panel de administración está protegido con Basic Auth
- Validación de datos en el servidor
- Sanitización de inputs del usuario

## Próximas Mejoras

- [ ] Exportación de datos a Excel/CSV
- [ ] Modo offline con sincronización
- [ ] Multi-idioma

## Autor

**Gael Campuzano** - Desarrollo del sistema de kiosco para Sunset Monalisa

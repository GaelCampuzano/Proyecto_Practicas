Kiosco de Propinas - Sunset Monalisa
====================================

Descripción
-----------
Aplicación web tipo kiosco para que los clientes de Sunset Monalisa dejen propina de forma digital. Flujo básico: el mesero ingresa su nombre y número de mesa, entrega el dispositivo al cliente, el cliente elige un porcentaje (20, 23 o 25) y el registro se guarda para consulta posterior en un panel administrador.

Características
--------------
- Interfaz para kiosco optimizada para tablet.
- Selección rápida de porcentaje de propina (20, 23, 25).
- API REST para crear y consultar registros de propinas.
- Base de datos local con `better-sqlite3` (sin servidor externo).
- Panel de administración con filtros por mesero y fechas, totales y exportación CSV.
- Protección del panel y consultas con Autenticación Básica.

Tecnologías
-----------
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express
- Base de datos: better-sqlite3 (SQLite embebido)
- Dependencias principales: express, dotenv, cors, basic-auth, better-sqlite3

Requisitos
----------
- Node.js 16 o superior
- npm (incluido con Node.js)

Instalación
-----------
1. Clonar el repositorio:
   - `git clone https://[https://github.com/GaelCampuzano/Proyecto_Practicas.git]/kiosco-sunset.git`
   - `cd kiosco-sunset`
2. Instalar dependencias:
   - `npm install`
3. Variables de entorno (crear archivo `.env` en la raíz):
   - `ADMIN_USER=admin`
   - `ADMIN_PASS=sunset123`
   - (Opcional) `PORT=3000`

Ejecución
---------
- Desarrollo (recarga con Node): `npm run dev`
- Producción: `npm start`

La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado).

Uso
---
- Kiosco: `http://localhost:3000`
- Panel administrador: `http://localhost:3000/admin.html` (requiere `ADMIN_USER` y `ADMIN_PASS`)

Estructura del proyecto
-----------------------
```
/
├── public/           # Archivos estáticos (kiosco y admin)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
├── data/             # Base de datos SQLite (tips.db)
├── package.json
├── server.js         # Servidor Express y API
└── README.md
```

API
---
POST `/api/tips`
- Descripción: Crea un nuevo registro de propina.
- Autenticación: No requiere.
- Body JSON:
```
{
  "table_number": "12",
  "waiter_name": "Gael",
  "tip_percentage": 20,
  "device_id": "opcional"
}
```
- Respuesta 201:
```
{ "id": 1, "message": "Propina registrada con éxito" }
```

GET `/api/tips`
- Descripción: Obtiene registros de propinas (ordenados por `created_at` desc).
- Autenticación: Básica (usar `ADMIN_USER` y `ADMIN_PASS`).
- Query params opcionales:
  - `startDate` (formato ISO o `YYYY-MM-DD`)
  - `endDate` (formato ISO o `YYYY-MM-DD`)
  - `waiterName` (coincidencia parcial)

Notas
-----
- La base de datos se crea automáticamente en `data/tips.db` al iniciar el servidor.
- Los índices sobre `created_at` y `waiter_name` se crean automáticamente.
- Los porcentajes válidos son 20, 23 y 25.

Scripts disponibles
-------------------
- `npm run dev`: `node --watch server.js`
- `npm start`: `node server.js`

Créditos
--------
- Responsable: David Peña (Gerente de implementaciones de sistemas)
- Ejecutor: Gael Campuzano (Practicante de desarrollo)

Licencia
--------
Este proyecto está licenciado bajo ISC (ver `package.json`).
<!-- Banner del Proyecto -->

<p align="center">
<img src="https://www.google.com/search?q=https://placehold.co/1200x400/1a202c/f4b860%3Ftext%3DKiosco%2520de%2520Propinas%26font%3Droboto" alt="Banner del Kiosco de Propinas Sunset Monalisa">
</p>

<h1 align="center">Kiosco de Propinas - Sunset Monalisa</h1>

<!-- Insignias (Badges) -->

<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Versi%25C3%25B3n-1.0%2520(MVP)-blue.svg" alt="Versión del Proyecto">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-16%252B-339933.svg%3Flogo%3Dnode.js" alt="Node.js">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Express-4.x-000000.svg%3Flogo%3Dexpress" alt="Express.js">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/SQLite-3-003B57.svg%3Flogo%3Dsqlite" alt="SQLite">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Licencia-MIT-yellow.svg" alt="Licencia MIT">
</p>

📝 Descripción
Este proyecto es una aplicación web de tipo kiosco diseñada para que los clientes del restaurante Sunset Monalisa puedan dejar propina de forma digital y sencilla. La aplicación sigue un flujo simple: el mesero ingresa sus datos y el número de mesa, le entrega el dispositivo (iPad/tablet) al cliente, el cliente selecciona un porcentaje de propina, y la transacción se registra en una base de datos para su posterior consulta.

Este proyecto fue desarrollado como un MVP (Producto Mínimo Viable) para validar la funcionalidad principal antes de una posible integración con sistemas de punto de venta.

Responsable: David Peña (Gerente de implementaciones de sistemas)

Ejecutor: Gael Campuzano (Practicante de desarrollo)

✨ Características Principales
📱 Flujo de Kiosco: Interfaz optimizada para tablets con un flujo claro: Mesero -> Cliente -> Agradecimiento.

👆 Selección de Propina: Botones grandes y claros para que el cliente seleccione entre 20%, 23% o 25%.

🌐 API REST: Un backend robusto para crear y consultar los registros de propinas de forma segura.

🗃️ Base de Datos Integrada: Utiliza SQLite para un almacenamiento de datos ligero y sin servidor externo.

📊 Dashboard de Administración: Una interfaz web para consultar todos los registros, con funcionalidades de:

Filtrado por nombre de mesero y rango de fechas.

Cálculo de totales y promedio de propinas.

Exportación de los datos filtrados a formato CSV.

🔐 Autenticación Segura: El dashboard y la API de consulta están protegidos mediante Autenticación Básica.

🚀 Tecnologías Utilizadas
Categoría

Tecnología

Frontend

HTML5, CSS3, JavaScript (ES6+)

Backend

Node.js, Express.js

Base de Datos

SQLite3

Dependencias

cors, dotenv, sqlite, sqlite3, nodemon

⚙️ Instalación y Puesta en Marcha
Sigue estos pasos para ejecutar el proyecto en un entorno de desarrollo local.

Prerrequisitos
Tener instalado Node.js (versión 16 o superior).

Tener instalado npm (incluido con Node.js).

Pasos
Clonar el repositorio:

git clone https://[URL-DEL-REPOSITORIO]/kiosco-sunset.git
cd kiosco-sunset

Instalar dependencias:
Este comando instalará todas las librerías necesarias del package.json.

npm install

Configurar las variables de entorno:
Crea una copia del archivo .env.example y renómbrala a .env.

# En Windows (cmd): copy .env.example .env
# En Linux/macOS: cp .env.example .env

Abre el archivo .env y ajusta las variables si es necesario. Las credenciales por defecto son admin y sunset123.

Iniciar el servidor de desarrollo:
Este comando utiliza nodemon para que el servidor se reinicie automáticamente con cada cambio.

npm run dev

¡Listo! La aplicación estará corriendo en http://localhost:3000.

🖥️ Uso de la Aplicación
Kiosco de Propinas:
➡️ http://localhost:3000

Dashboard de Administración:
➡️ http://localhost:3000/admin.html
(Requiere las credenciales configuradas en el archivo .env)

<details>
<summary>📁 Ver la Estructura del Proyecto</summary>

/
├── public/           # Archivos estáticos para el cliente (Kiosco y Admin)
│   ├── index.html    # Interfaz del kiosco
│   ├── style.css     # Estilos del kiosco
│   ├── app.js        # Lógica del kiosco
│   ├── admin.html    # Interfaz del dashboard
│   ├── admin.css     # Estilos del dashboard
│   └── admin.js      # Lógica del dashboard
├── data/             # Carpeta donde se crea la base de datos SQLite
├── .env              # (No versionado) Archivo de variables de entorno
├── .env.example      # Ejemplo de las variables de entorno requeridas
├── package.json      # Dependencias y scripts del proyecto
├── server.js         # Servidor principal (API y servicio de archivos estáticos)
└── README.md         # Esta documentación

</details>

<details>
<summary>📡 Ver los Endpoints de la API</summary>

POST /api/tips
Descripción: Crea un nuevo registro de propina.

Protección: Abierto (Público).

Cuerpo de la Petición (JSON):

{
  "table_number": "12",
  "waiter_name": "Gael",
  "tip_percentage": 20
}

GET /api/tips
Descripción: Obtiene los registros de propinas. Acepta parámetros de consulta para filtrar.

Protección: Autenticación Básica.

Parámetros de Consulta (Opcionales):

waiter: Filtra por nombre de mesero.

startDate: Filtra desde una fecha de inicio (formato YYYY-MM-DD).

endDate: Filtra hasta una fecha de fin (formato YYYY-MM-DD).

</details>

📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
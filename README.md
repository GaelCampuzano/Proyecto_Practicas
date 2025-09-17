Kiosco de Propinas - Sunset Monalisa (Versión 1.0 - MVP)
Descripción
Este proyecto es una aplicación web de tipo kiosco diseñada para que los clientes del restaurante Sunset Monalisa puedan dejar propina de forma digital y sencilla. La aplicación sigue un flujo simple: el mesero ingresa sus datos y el número de mesa, le entrega el dispositivo (iPad/tablet) al cliente, el cliente selecciona un porcentaje de propina, y la transacción se registra en una base de datos para su posterior consulta.

Este proyecto fue desarrollado como un MVP (Producto Mínimo Viable) para validar la funcionalidad principal antes de una posible integración con sistemas de punto de venta.

Responsable: David Peña (Gerente de implementaciones de sistemas)
Ejecutor: Gael Campuzano (Practicante de desarrollo)

Características Principales (MVP)
Flujo de Kiosco: Interfaz optimizada para tablets con un flujo claro: Mesero -> Cliente -> Agradecimiento.

Selección de Propina: Botones grandes y claros para que el cliente seleccione entre 20%, 23% o 25%.

API REST: Un backend robusto para crear y consultar los registros de propinas de forma segura.

Base de Datos Integrada: Utiliza SQLite para un almacenamiento de datos ligero y sin necesidad de un servidor de base de datos externo.

Dashboard de Administración: Una interfaz web para consultar todos los registros, con funcionalidades de:

Filtrado por nombre de mesero.

Filtrado por rango de fechas.

Cálculo de totales y promedio de propinas.

Exportación de los datos filtrados a formato CSV.

Autenticación Segura: El dashboard y la API de consulta están protegidos mediante Autenticación Básica.

Tecnologías Utilizadas
Frontend: HTML5, CSS3, JavaScript (ES6+)

Backend: Node.js, Express.js

Base de Datos: SQLite3

Dependencias Adicionales: cors, dotenv, sqlite, sqlite3

Estructura del Proyecto
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

Instalación y Puesta en Marcha
Sigue estos pasos para ejecutar el proyecto en un entorno de desarrollo local.

Prerrequisitos
Tener instalado Node.js (versión 16 o superior recomendada).

Tener instalado npm (generalmente viene con Node.js).

Pasos
Clonar el repositorio (o descomprimir los archivos):

# git clone https://[URL-DEL-REPOSITORIO]/kiosco-sunset.git
cd kiosco-sunset

Instalar dependencias:
Este comando leerá el package.json e instalará todas las librerías necesarias (express, sqlite3, etc.).

npm install

Configurar las variables de entorno:
Crea una copia del archivo .env.example y renómbrala a .env.

# En Windows (cmd)
copy .env.example .env
# En Linux/macOS/Git Bash
cp .env.example .env

Abre el archivo .env y ajusta las variables si es necesario. Las credenciales por defecto son:

ADMIN_USER=admin

ADMIN_PASS=sunset123

Iniciar el servidor:
Este comando utiliza nodemon para iniciar el servidor. El servidor se reiniciará automáticamente cada vez que hagas un cambio en los archivos.

npm run dev

Si todo va bien, verás el siguiente mensaje en la consola:
Servidor escuchando en http://localhost:3000

Uso de la Aplicación
Kiosco de Propinas:
Abre tu navegador y ve a http://localhost:3000

Dashboard de Administración:
Abre tu navegador y ve a http://localhost:3000/admin.html

Se te pedirán las credenciales de administrador que configuraste en el archivo .env.

Endpoints de la API
POST /api/tips

Descripción: Crea un nuevo registro de propina.

Cuerpo (Body) de la Petición (JSON):

{
  "table_number": "12",
  "waiter_name": "Gael",
  "tip_percentage": 20
}

Protección: Abierto (Público).

GET /api/tips

Descripción: Obtiene todos los registros de propinas. Acepta parámetros de consulta para filtrar.

Parámetros de Consulta (Query Params):

waiter (opcional): Filtra por el nombre del mesero (no distingue mayúsculas/minúsculas).

startDate (opcional): Filtra registros creados desde esta fecha (formato YYYY-MM-DD).

endDate (opcional): Filtra registros creados hasta esta fecha (formato YYYY-MM-DD).

Protección: Autenticación Básica.
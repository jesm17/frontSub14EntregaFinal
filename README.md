# frontSub14EntregaFinal

Proyecto estructurado como **monorepo** con dos aplicaciones principales:

- `front/`: cliente web en Angular
- `backend/`: API en NestJS conectada a MongoDB

## Arquitectura del proyecto

Este repositorio usa un enfoque de monorepo con `npm workspaces`, lo que permite mantener frontend y backend en un mismo código fuente, compartiendo flujo de trabajo, scripts y versionado.

### Componentes

- **Frontend (`front`)**
  - Framework: Angular
  - Responsabilidad: interfaz de usuario, rutas del cliente y consumo de API
  - Build de producción en `front/dist/`

- **Backend (`backend`)**
  - Framework: NestJS
  - Responsabilidad: lógica de negocio, endpoints HTTP y acceso a datos
  - Integración con MongoDB mediante `@nestjs/mongoose` y `mongoose`
  - Configuración por variable de entorno `MONGODB_URI`

- **Base de datos**
  - Motor: MongoDB
  - URI por defecto (desarrollo): `mongodb://127.0.0.1:27017/frontsub14`
  - Archivo de ejemplo de variables: `backend/.env.example`

## Estructura de carpetas

```text
.
|-- front/              # Aplicación Angular
|-- backend/            # API NestJS + conexión MongoDB
|-- package.json        # Configuración raíz del monorepo (workspaces + scripts)
|-- package-lock.json
`-- .gitignore
```

## Que es un monorepo y por que se usa aqui

Un monorepo es una estrategia donde múltiples proyectos relacionados viven en un único repositorio.

Ventajas en este proyecto:

- **Consistencia**: una sola fuente de verdad para dependencias y scripts globales.
- **Productividad**: front y back se levantan y mantienen desde el mismo lugar.
- **Mantenimiento**: cambios coordinados entre cliente y API con un solo historial Git.
- **Escalabilidad**: facilita agregar nuevos paquetes o apps (por ejemplo, librerías compartidas).

## Scripts principales (raiz)

Desde la raíz del repositorio:

- `npm run start:front`: inicia Angular
- `npm run start:backend`: inicia Nest en modo desarrollo
- `npm run build`: compila frontend y backend

## Instalacion y ejecucion

1. Instalar dependencias del monorepo:

```bash
npm install
```

2. Configurar variables de entorno del backend:

```bash
cp backend/.env.example backend/.env
```

En Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

3. Iniciar aplicaciones:

```bash
npm run start:backend
npm run start:front
```

## Variables de entorno

En `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/frontsub14
```

## Estado actual del proyecto

- Monorepo configurado con `npm workspaces`
- Frontend Angular creado y compilando correctamente
- Backend NestJS creado y compilando correctamente
- Conexión a MongoDB configurada en el módulo principal del backend

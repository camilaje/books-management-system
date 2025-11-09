## 📚 Books Management System

CRUD de libros desarrollado con Node.js + Express + TypeORM + SQL Server y Angular.
Incluye autenticación JWT, paginación, filtros, ordenamiento y documentación con Swagger.

### 1) Requisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js 18+

- npm 9+

- SQL Server (local o remoto)

- (Opcional) Git

### 2) Configuración
#### 2.1 Clonar el repositorio

- Para obtener el código del proyecto:
https://github.com/camilaje/books-management-system/tree/main

#### 2.2 Variables de entorno (Backend)

Copia el archivo de ejemplo y ajusta tus credenciales:

````
cd backend
````
````
cp .env.example .env   # En PowerShell usa: copy .env.example .env
````


Edita el archivo .env con tus valores:
````
PORT=3000
DB_HOST=localhost
DB_USER=sa
DB_PASS=yourStrong(!)Password
DB_NAME=booksdb
DB_PORT=1433
JWT_SECRET=supersecret
LOG_LEVEL=info
````

> Asegúrate de que tu instancia de SQL Server esté accesible con esas credenciales y que la base de datos booksdb exista (o configura TypeORM para crearla o migrarla automáticamente).

#### 2.3 Variables de entorno (Frontend)

Si usas Angular, valida la configuración del environment.ts:

````typescript
// frontend/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/'
};
````

### 3) Instalación

#### Backend
````
cd backend
````
````
npm install
````

#### Frontend
````
cd ../frontend
````
````
npm install
````


### 4) Ejecución en desarrollo
#### 4.1 Levantar el Backend
````
cd backend
````
````
npm run dev
````
> La API quedará disponible en: http://localhost:3000

> Swagger: http://localhost:3000/api/docs

#### 4.3 Levantar el Frontend
 ````
cd ../frontend
````
````
npm start
````
> La app quedará en: http://localhost:4200


Usa el usuario seed o uno existente en tu base de datos.
Tras autenticación, el interceptor adjuntará automáticamente Authorization: Bearer <token> en las llamadas protegidas.

### 5) Ejecución en producción (build)
Backend (build + start)
cd backend
npm run build
npm start

Frontend (build estático)
cd ../frontend
npm run build
# El resultado queda en frontend/dist/...
# Sirve estos archivos con Nginx, Apache o un servidor estático

📡 6) Endpoints principales
- POST,	/api/auth/login, Retorna { token }
- GET	/api/books?page=&limit=&q=&status=&sort=, Lista libros con filtros y paginación
- GET	/api/books/:id, Obtiene detalle de un libro
- POST	/api/books, Crea un nuevo libro
- PUT	/api/books/:id, Actualiza un libro existente
- DELETE	/api/books/:id, Elimina un libro

Swagger UI:
👉 http://localhost:3000/api/docs

### 7) Accesos
Servicio	URL
Frontend (Angular App)	http://localhost:4200

Backend (API)	http://localhost:3000

Swagger Docs	http://localhost:3000/api/docs

## 📘 Arquitectura y Patrones de Diseño

### 1) Arquitectura general
> Pegar codigo fuente para el diagrama en https://mermaid.js.org/
````
flowchart LR
  U[Usuario] --> FE[Frontend Angular]
  FE -->|HTTP/JSON| API[Backend REST]
  API --> DB[(SQL Server)]
````

### 2) Patrones de diseño utilizados
| Patrón                        | Descripción                                 | Implementación                                            |
| ----------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| Controller-Service-Repository | Separa presentación, lógica y datos         | `book.controller.ts`, `book.service.ts`, `book.entity.ts` |
| Singleton                     | Servicio compartido globalmente             | `AuthService` en Angular y backend                        |
| Dependency Injection          | Inyección de dependencias para modularidad  | `@Injectable` y constructores en Angular/Node             |
| Middleware                    | Flujo de responsabilidades encadenadas      | `requireAuth`, `errorHandler`                             |
| Observables                   | Comunicación reactiva y suscripción a datos | `BehaviorSubject`, `FormGroup`                            |
| BEM                           | Convención escalable de CSS                 | `.login__form`, `.books__table`                           |

### 3) Estructura de carpetas
````
backend/
 ├─ src/
 │   ├─ modules/
 │   │   ├─ auth/
 │   │   └─ books/
 │   ├─ middlewares/
 │   ├─ config/
 │   ├─ app.ts
 │   └─ index.ts

frontend/
 ├─ src/
 │   ├─ app/
 │   │   ├─ core/
 |   |   |     ├─ auth/
 |   |   |     ├─ books/
 |   |   |     ├─ guards/
 |   |   |     ├─ interceptors/
 │   │   ├─ shared/
 │   │   └─ routes/
 │   └─ environments/
````

### 4) Diagrama de secuencias
> Pegar codigo fuente para el diagrama en https://mermaid.js.org/

 ````
 sequenceDiagram
  participant User
  participant Angular
  participant API
  participant DB
  User->>Angular: Login (email, password)
  Angular->>API: POST /api/auth/login
  API->>DB: SELECT * FROM users WHERE email
  DB-->>API: Usuario válido
  API-->>Angular: JWT Token
  Angular-->>User: Acceso autorizado
 ````

 ### 5) Diagrama de flujos para el CRUD
 > Pegar codigo fuente para el diagrama en https://mermaid.js.org/

 ````
sequenceDiagram
  participant U as Usuario
  participant FE as Frontend Angular
  participant INT as AuthInterceptor
  participant API as Express API
  participant DB as SQL Server

  U->>FE: Solicita listar libros
  FE->>INT: GET /api/books?page=1&limit=10
  INT->>API: Adjunta Authorization: Bearer <token>
  API->>DB: SELECT * FROM books LIMIT 10
  DB-->>API: Lista de libros
  API-->>FE: JSON con { items, total, pages }
  FE-->>U: Muestra tabla con paginación

  U->>FE: Crea nuevo libro
  FE->>INT: POST /api/books (payload)
  INT->>API: Envía con JWT
  API->>DB: INSERT INTO books (...)
  DB-->>API: OK
  API-->>FE: 201 Created
  FE-->>U: Refresca listado

 ````
# Script de base de datos
````
-- ============================================================
-- 📚 Books Management System - Base de datos inicial
-- Autor: Camilo García
-- Fecha: 2025-11-09
-- Motor: Microsoft SQL Server
-- ============================================================

-- 1️⃣ Crear base de datos
CREATE DATABASE booksdb;
GO

USE booksdb;
GO

-- 2️⃣ Crear tabla de usuarios
CREATE TABLE [dbo].[users] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [email] NVARCHAR(100) NOT NULL UNIQUE,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(50) NOT NULL DEFAULT('user'),
    [createdAt] DATETIME NOT NULL DEFAULT(GETDATE())
);
GO

-- 3️⃣ Crear tabla de libros
CREATE TABLE [dbo].[books] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [title] NVARCHAR(200) NOT NULL,
    [author] NVARCHAR(150) NOT NULL,
    [year] INT NOT NULL,
    [status] NVARCHAR(50) NOT NULL DEFAULT('available'),
    [createdAt] DATETIME NOT NULL DEFAULT(GETDATE())
);
GO

-- 4️⃣ Insertar usuario administrador por defecto
-- (Contraseña: admin123 — recuerda reemplazar por hash real si usas bcrypt)
INSERT INTO [dbo].[users] ([email], [passwordHash], [role])
VALUES ('admin@example.com', '$2b$10$ABCDEFGHijklmnopqrstuv1234567890abcdefghij', 'admin');
GO

-- 5️⃣ Datos iniciales opcionales
INSERT INTO [dbo].[books] ([title], [author], [year], [status])
VALUES 
('El Quijote', 'Miguel de Cervantes', 1605, 'available'),
('Cien años de soledad', 'Gabriel García Márquez', 1967, 'reserved'),
('Rayuela', 'Julio Cortázar', 1963, 'available');
GO

````



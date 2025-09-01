# Hebron LDG Tienda - Base de Datos PostgreSQL

## Descripción

Este proyecto implementa la estructura de base de datos PostgreSQL para una tienda online de comida libre de gluten. Incluye todo lo necesario para gestionar usuarios, productos, categorías, pedidos y pagos.

## Estructura de Base de Datos

### Tablas Principales

#### 1. **users** - Usuarios Registrados
- `id` (UUID, PK): Identificador único
- `full_name` (VARCHAR): Nombre completo
- `email` (VARCHAR, UNIQUE): Email único para login
- `phone` (VARCHAR): Teléfono de contacto  
- `address` (TEXT): Dirección de entrega
- `password_hash` (VARCHAR): Contraseña hasheada con bcrypt
- `is_admin` (BOOLEAN): Permisos de administrador
- `created_at`, `updated_at` (TIMESTAMP): Fechas de auditoría

#### 2. **categories** - Categorías de Productos
- `id` (UUID, PK): Identificador único
- `name` (VARCHAR, UNIQUE): Nombre de la categoría
- `description` (TEXT): Descripción detallada
- `active` (BOOLEAN): Estado activo/inactivo
- `created_at` (TIMESTAMP): Fecha de creación

#### 3. **products** - Catálogo de Productos
- `id` (UUID, PK): Identificador único
- `name` (VARCHAR): Nombre del producto
- `description` (TEXT): Descripción detallada
- `category` (VARCHAR): Categoría del producto
- `price` (DECIMAL): Precio en pesos argentinos
- `varieties` (JSONB): Variedades y presentaciones disponibles
- `images` (JSONB): URLs de imágenes del producto
- `active` (BOOLEAN): Estado activo/inactivo
- `created_at`, `updated_at` (TIMESTAMP): Fechas de auditoría

#### 4. **orders** - Pedidos Realizados
- `id` (UUID, PK): Identificador único del pedido
- `customer_name`, `customer_email`, `customer_phone`, `customer_address`: Datos del cliente
- `delivery_method` (VARCHAR): Método de entrega (delivery, retiro)
- `payment_method` (VARCHAR): Método de pago
- `payment_status` (VARCHAR): Estado del pago
- `transaction_id` (VARCHAR): ID de transacción externa
- `total_amount` (DECIMAL): Monto total del pedido
- `status` (VARCHAR): Estado del pedido (pending, confirmed, preparing, ready, delivered)
- `notes` (TEXT): Notas adicionales
- `created_at`, `updated_at` (TIMESTAMP): Fechas de auditoría

#### 5. **order_items** - Items de Cada Pedido
- `id` (UUID, PK): Identificador único
- `order_id` (UUID, FK): Referencia al pedido
- `product_id` (UUID, FK): Referencia al producto
- `product_name` (VARCHAR): Nombre del producto (snapshot)
- `variety` (VARCHAR): Variedad seleccionada
- `quantity` (INTEGER): Cantidad solicitada
- `unit_price` (DECIMAL): Precio unitario (snapshot)
- `subtotal` (DECIMAL): Subtotal calculado
- `created_at` (TIMESTAMP): Fecha de creación

#### 6. **payments** - Información de Pagos
- `id` (UUID, PK): Identificador único
- `order_id` (UUID, FK): Referencia al pedido
- `payment_method` (VARCHAR): Método de pago utilizado
- `transaction_id` (VARCHAR, UNIQUE): ID único de transacción
- `external_payment_id` (VARCHAR): ID externo del gateway
- `amount` (DECIMAL): Monto del pago
- `currency` (VARCHAR): Moneda (ARS por defecto)
- `status` (VARCHAR): Estado del pago
- `payment_date` (TIMESTAMP): Fecha/hora del pago
- `gateway_response` (JSONB): Respuesta completa del gateway
- `notes` (TEXT): Notas adicionales
- `created_at`, `updated_at` (TIMESTAMP): Fechas de auditoría

### Índices para Optimización

- Productos por categoría y estado activo
- Pedidos por estado y email del cliente
- Items de pedido por order_id
- Pagos por order_id y estado

### Triggers Automáticos

- Actualización automática del campo `updated_at` en todas las tablas relevantes

## Configuración del Entorno

### 1. Variables de Entorno (.env)

Copiar `.env.example` a `.env` y configurar:

```bash
# Base de datos Koyeb PostgreSQL
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Configuración del servidor
NODE_ENV=development
PORT=3000

# Seguridad JWT
JWT_SECRET=tu-clave-jwt-super-secreta

# Configuraciones adicionales
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Inicialización de Base de Datos

```bash
# Crear todas las tablas
npm run init-db

# Poblar con datos de ejemplo
npm run seed
```

## Scripts Disponibles

- `npm start` - Ejecutar servidor en producción
- `npm run dev` - Ejecutar servidor en desarrollo con nodemon
- `npm run init-db` - Crear estructura de base de datos
- `npm run seed` - Poblar base de datos con datos de ejemplo

## Funcionalidades Implementadas

### 🔐 Autenticación y Seguridad
- Registro y login de usuarios
- Hash de contraseñas con bcryptjs
- Autenticación JWT
- Middleware de protección de rutas
- Validación de datos de entrada

### 🛍️ Gestión de Productos
- CRUD completo de productos
- Categorización de productos
- Gestión de variedades y presentaciones
- Subida de imágenes
- Filtros y búsqueda

### 📦 Sistema de Pedidos
- Creación de pedidos con múltiples items
- Gestión de estados de pedidos
- Cálculo automático de totales
- Historial de pedidos por usuario

### 💳 Procesamiento de Pagos
- Integración preparada para Brubank
- Registro detallado de transacciones
- Webhooks para notificaciones de pago
- Estados de pago en tiempo real

### 👨‍💼 Panel de Administración
- Gestión de productos y categorías
- Monitoreo de pedidos
- Estados y seguimiento de entregas

## Usuarios de Prueba

Después de ejecutar el seed:

- **Admin**: admin@glutenfreestore.com / admin123
- **Usuario**: usuario@ejemplo.com / usuario123

## Mejores Prácticas Implementadas

- ✅ Uso de UUIDs para mayor seguridad
- ✅ Campos JSONB para flexibilidad en variedades e imágenes
- ✅ Triggers automáticos para auditoría
- ✅ Índices optimizados para consultas frecuentes
- ✅ Transacciones para operaciones críticas
- ✅ Soft deletes para mantener integridad
- ✅ Validación de datos en backend
- ✅ Rate limiting y CORS configurados
- ✅ Logs detallados para debugging

## Integración con Koyeb

Para desplegar en Koyeb:

1. Crear servicio PostgreSQL en Koyeb
2. Obtener URL de conexión
3. Configurar variable `DATABASE_URL` en el servicio
4. Ejecutar migraciones automáticamente al desplegar

## Soporte y Mantenimiento

La estructura está diseñada para ser escalable y mantenible:
- Migraciones versionadas
- Logs estructurados
- Monitoreo de health checks
- Backup automático recomendado
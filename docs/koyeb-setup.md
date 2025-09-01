# Configuración de Base de Datos en Koyeb

## Pasos para Configurar PostgreSQL en Koyeb

### 1. Crear Base de Datos PostgreSQL

1. Ingresar a [Koyeb Dashboard](https://app.koyeb.com)
2. Ir a la sección "Databases"
3. Hacer clic en "Create Database"
4. Seleccionar PostgreSQL
5. Configurar:
   - **Región**: Seleccionar la más cercana (ej: Frankfurt para Europa)
   - **Plan**: Starter (gratis) o según necesidades
   - **Nombre**: `hebron-ldg-tienda-db`
   - **Configuraciones adicionales**: Dejar por defecto

### 2. Obtener Cadena de Conexión

Una vez creada la base de datos:

1. Ir al dashboard de la base de datos creada
2. En la pestaña "Overview", buscar "Connection Information"
3. Copiar la URL de conexión que tendrá el formato:
   ```
   postgresql://username:password@hostname:port/database_name
   ```

### 3. Configurar Variables de Entorno

En tu aplicación de Koyeb:

1. Ir a la configuración de tu aplicación/servicio
2. En la sección "Environment Variables", agregar:
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   NODE_ENV=production
   JWT_SECRET=tu-clave-jwt-super-secreta-de-produccion
   ```

### 4. Inicializar Base de Datos

#### Opción A: Desde tu máquina local

```bash
# Configurar DATABASE_URL en .env con la URL de Koyeb
echo "DATABASE_URL=postgresql://username:password@hostname:port/database_name" > .env

# Ejecutar migraciones
npm run init-db

# Poblar con datos iniciales
npm run seed
```

#### Opción B: Desde Koyeb (Recomendado)

1. Desplegar la aplicación en Koyeb
2. Una vez desplegada, ejecutar los comandos en el terminal de Koyeb:
   ```bash
   npm run init-db
   npm run seed
   ```

### 5. Verificar Conexión

La aplicación incluye un endpoint de health check:

```bash
curl https://tu-app.koyeb.app/api/health
```

Debería devolver algo como:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Configuración de Seguridad

### SSL/TLS

Koyeb PostgreSQL viene con SSL habilitado por defecto. La configuración en el código ya incluye:

```javascript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

### Backup y Recuperación

1. **Backup Automático**: Koyeb realiza backups automáticos diarios
2. **Backup Manual**: Se puede crear desde el dashboard de Koyeb
3. **Recuperación**: Restaurar desde el dashboard seleccionando un backup

### Monitoreo

1. **Dashboard Koyeb**: Métricas de uso, conexiones, queries
2. **Logs**: Ver logs de la aplicación en tiempo real
3. **Alertas**: Configurar alertas por email/Slack

## Mejores Prácticas

### Variables de Entorno de Producción

```bash
# Base de datos
DATABASE_URL=postgresql://...  # URL real de Koyeb

# Seguridad
NODE_ENV=production
JWT_SECRET=clave-jwt-super-secreta-de-64-caracteres-minimo

# CORS
CORS_ORIGIN=https://tudominio.com

# Rate Limiting (más restrictivo en producción)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

### Escalabilidad

1. **Pool de Conexiones**: Ya configurado (max 20 conexiones)
2. **Índices**: Implementados para optimizar consultas
3. **Paginación**: Implementada en endpoints de listado

### Mantenimiento

```bash
# Verificar estado de tablas
psql $DATABASE_URL -c "\dt"

# Ver estadísticas de uso
psql $DATABASE_URL -c "SELECT schemaname,tablename,n_tup_ins,n_tup_upd,n_tup_del FROM pg_stat_user_tables;"

# Limpiar logs antiguos (opcional)
psql $DATABASE_URL -c "DELETE FROM pg_stat_statements;"
```

## Troubleshooting

### Error de Conexión

```bash
# Verificar conectividad
telnet hostname port

# Verificar credenciales
psql $DATABASE_URL -c "SELECT current_user;"
```

### Performance Issues

```bash
# Ver queries lentas
psql $DATABASE_URL -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Ver conexiones activas
psql $DATABASE_URL -c "SELECT pid, usename, application_name, state FROM pg_stat_activity WHERE state = 'active';"
```

### Logs

```bash
# En producción, los logs se pueden ver en Koyeb Dashboard
# O configurar logging externo (ej: Datadog, LogRocket)
```

## Scripts de Utilidad

### Backup Manual

```bash
# Crear backup local
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
psql $DATABASE_URL < backup_file.sql
```

### Reset Base de Datos

```bash
# ⚠️  CUIDADO: Esto eliminará TODOS los datos
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run init-db
npm run seed
```

Este setup garantiza una base de datos robusta, segura y escalable para tu tienda online de productos sin gluten.
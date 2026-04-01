#!/bin/sh
set -e

echo "=== VoltBody entrypoint ==="

# -------------------------------------------------------------------
# Limpiar artefactos de versiones anteriores que puedan quedar
# en capas cacheadas o volúmenes persistentes
# -------------------------------------------------------------------
echo "Limpiando artefactos antiguos..."
rm -rf /app/server/routes /app/server/*.js /app/server/*.map 2>/dev/null || true

# Si existe un directorio /app/public antiguo que NO sea el build actual, eliminarlo
if [ -d "/app/public" ] && [ -d "/app/dist" ]; then
  echo "Eliminando /app/public antiguo (frontend se sirve desde /app/dist)..."
  rm -rf /app/public
fi

# -------------------------------------------------------------------
# Copiar frontend build a /app/public como alias para compatibilidad
# (en caso de que alguna configuración apunte ahí)
# -------------------------------------------------------------------
if [ -d "/app/dist" ]; then
  echo "Copiando frontend dist -> /app/public para compatibilidad..."
  cp -r /app/dist /app/public
fi

# -------------------------------------------------------------------
# Ejecutar migraciones de Prisma
# -------------------------------------------------------------------
echo "Ejecutando Prisma migrate deploy..."
npx prisma generate
npx prisma migrate deploy
echo "Migraciones completadas."

# -------------------------------------------------------------------
# Arrancar servidor
# -------------------------------------------------------------------
echo "Iniciando servidor..."
exec node server/dist/index.js

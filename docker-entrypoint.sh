#!/bin/sh
set -e

echo "=== VoltBody entrypoint ==="
echo "Node: $(node --version)"
echo "Contenido /app/server/dist: $(ls /app/server/dist/ 2>/dev/null || echo 'NO EXISTE')"

# Limpiar artefactos de builds/imagenes antiguas
rm -rf /app/server/routes 2>/dev/null || true
rm -f /app/server/*.js /app/server/*.map 2>/dev/null || true

# Ejecutar migraciones (crea tablas en deploy fresco, noop si ya existen)
echo "[prisma] Ejecutando migrate deploy..."
npx prisma migrate deploy
echo "[prisma] Migraciones OK"

# Arrancar servidor (ensureLegacyCompatibility() se encarga del resto al iniciar)
echo "[start] node server/dist/index.js"
exec node server/dist/index.js

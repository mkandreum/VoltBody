#!/bin/sh
set -e

echo "=== VoltBody entrypoint ==="
echo "Node: $(node --version)"
echo "PWD: $(pwd)"
echo "Contenido /app/server/dist: $(ls /app/server/dist/ 2>/dev/null || echo 'NO EXISTE')"

# -------------------------------------------------------------------
# Limpiar artefactos de builds antiguos
# -------------------------------------------------------------------
echo "[cleanup] Eliminando artefactos antiguos..."
rm -rf /app/server/routes 2>/dev/null || true
rm -f /app/server/*.js /app/server/*.map 2>/dev/null || true

# Copiar frontend a /app/public como alias
if [ -d "/app/dist" ]; then
  rm -rf /app/public 2>/dev/null || true
  cp -r /app/dist /app/public
  echo "[cleanup] Frontend copiado a /app/public"
fi

echo "[cleanup] Static path /app/dist existe: $(test -d /app/dist && echo SI || echo NO)"
echo "[cleanup] Static path /app/public existe: $(test -d /app/public && echo SI || echo NO)"

# -------------------------------------------------------------------
# Migraciones Prisma
# -------------------------------------------------------------------
echo "[prisma] Ejecutando migrate deploy..."
npx prisma migrate deploy
echo "[prisma] Migraciones completadas"

# -------------------------------------------------------------------
# Reparacion directa de columnas (por si las migraciones ya estaban
# marcadas como aplicadas pero la tabla no tenia las columnas)
# -------------------------------------------------------------------
echo "[repair] Reparando columnas faltantes via SQL directo..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const cmds = [
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"goalDirection\" TEXT NOT NULL DEFAULT \\'mantener\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"fitnessGoal\" TEXT NOT NULL DEFAULT \\'recomposicion\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"activityLevel\" TEXT NOT NULL DEFAULT \\'moderado\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"dailySteps\" INTEGER NOT NULL DEFAULT 7000',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"trainingPlace\" TEXT NOT NULL DEFAULT \\'gym\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"trainTime\" TEXT NOT NULL DEFAULT \\'19:00\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"trainDaysCsv\" TEXT NOT NULL DEFAULT \\'lunes,martes,miercoles,viernes,sabado\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"prioritiesCsv\" TEXT NOT NULL DEFAULT \\'pierna,espalda\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"foodPathologies\" TEXT NOT NULL DEFAULT \\'\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"injuryPathologies\" TEXT NOT NULL DEFAULT \\'\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialClass\" TEXT NOT NULL DEFAULT \\'zumba_instructor_jean\\'',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"targetKg\" INTEGER NOT NULL DEFAULT 4',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"targetMonths\" INTEGER NOT NULL DEFAULT 4',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishName\" TEXT',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishCalories\" INTEGER',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishProteins\" INTEGER',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishCarbs\" INTEGER',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishFats\" INTEGER',
    'ALTER TABLE IF EXISTS \"UserProfile\" ADD COLUMN IF NOT EXISTS \"specialDishPrep\" TEXT',
  ];
  for (const sql of cmds) {
    try { await p.\$executeRawUnsafe(sql); } catch(e) { console.error('[repair] WARN:', e.message); }
  }
  console.log('[repair] Columnas verificadas OK');
  await p.\$disconnect();
})().catch(e => { console.error('[repair] Error:', e); process.exit(0); });
"

# -------------------------------------------------------------------
# Arrancar servidor
# -------------------------------------------------------------------
echo "[start] Ejecutando: node server/dist/index.js"
exec node server/dist/index.js

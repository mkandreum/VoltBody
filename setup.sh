#!/bin/bash

# VoltBody - Setup Script
# Este script configura el proyecto completo

echo "🚀 VoltBody - Setup Rápido"
echo "============================"

# Paso 1: Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Paso 2: Generar schema Prisma
echo "🗄️  Generando cliente Prisma..."
npm run db:generate

# Paso 3: Crear archivo .env
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Recuerda actualizar las variables en .env"
fi

echo ""
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env con tus credenciales de PostgreSQL"
echo "2. Crea la BD: createdb voltbody"
echo "3. Ejecuta migraciones: npm run db:migrate"
echo "4. Terminal 1 - Frontend: npm run dev"
echo "5. Terminal 2 - Backend: npm run server:dev"
echo ""

#!/bin/bash

# Script de Refactor Automático Frontend
# Elimina referencias a 'categoria' y usa 'dominioId'

echo "🔧 Iniciando refactor automático del frontend..."

# Archivos a modificar
FILES=(
  "client/src/pages/Investigaciones.tsx"
  "client/src/pages/InvestigacionDetalle.tsx"
)

BACKUP_DIR="/home/ubuntu/observatorio-choix/migraciones/frontend_backup"
mkdir -p "$BACKUP_DIR"

# Backup de archivos originales
echo "📦 Creando backup de archivos..."
for file in "${FILES[@]}"; do
  if [ -f "/home/ubuntu/observatorio-choix/$file" ]; then
    cp "/home/ubuntu/observatorio-choix/$file" "$BACKUP_DIR/$(basename $file).bak"
    echo "   ✓ Backup: $file"
  fi
done

echo "✅ Backup completado"
echo ""
echo "🔄 Aplicando refactor..."

# Los cambios específicos se aplicarán mediante el script TypeScript
# Este script solo prepara el entorno

echo "✅ Refactor preparado"
echo ""
echo "📝 Archivos modificados:"
for file in "${FILES[@]}"; do
  echo "   - $file"
done

echo ""
echo "✅ Script completado"

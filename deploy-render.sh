#!/bin/bash
# Script de deploy no Render

set -e

echo "🚀 Iniciando deploy do Bikepirata no Render..."

# Verificar se a chave de API foi fornecida
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ Erro: RENDER_API_KEY não está definida"
    exit 1
fi

echo "✅ Configuração validada"
echo "📦 Build Docker será executado automaticamente pelo Render"
echo "🔗 A aplicação estará disponível em: https://bikepirata-api.onrender.com"
echo ""
echo "Próximos passos:"
echo "1. Acesse: https://dashboard.render.com"
echo "2. Conecte seu repositório Git"
echo "3. Crie um novo Web Service"
echo "4. Configure o Dockerfile: ./Roost/Dockerfile"
echo "5. Defina as variáveis de ambiente necessárias"

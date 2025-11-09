#!/bin/bash

# Script de deploy para Firebase Functions com verificação de variáveis de ambiente
# Usage: ./deploy.sh

set -e

echo "🚀 Firebase Functions Deployment Script"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Verificar se estamos na pasta functions
if [ ! -f "package.json" ]; then
    print_error "Este script deve ser executado da pasta 'functions'"
    exit 1
fi

print_info "Verificando dependências..."

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI não está instalado"
    echo "Instale com: npm install -g firebase-tools"
    exit 1
fi

print_success "Firebase CLI encontrado"

# Verificar se está logado no Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "Você não está logado no Firebase"
    echo "Execute: firebase login"
    exit 1
fi

print_success "Autenticado no Firebase"

# Mostrar projeto atual
PROJECT=$(firebase use | grep "Now using" | awk '{print $NF}' || echo "nenhum")
print_info "Projeto atual: $PROJECT"
echo ""

# Perguntar se deseja continuar
read -p "Deseja continuar com o deploy para este projeto? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deploy cancelado"
    exit 0
fi

echo ""
print_info "Verificando secrets configurados..."
echo ""

# Lista de secrets necessários
REQUIRED_SECRETS=("OPENAI_API_KEY" "ZAPI_INSTANCE" "ZAPI_TOKEN" "ZAPI_CLIENT_TOKEN")
MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if firebase functions:secrets:access "$secret" &> /dev/null; then
        print_success "$secret está configurado"
    else
        print_warning "$secret NÃO está configurado"
        MISSING_SECRETS+=("$secret")
    fi
done

echo ""

# Se houver secrets faltando, configurar agora
if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    print_warning "Alguns secrets não estão configurados!"
    echo ""
    echo "Vamos configurá-los agora."
    echo ""

    # Perguntar se deseja configurar agora ou cancelar
    read -p "Deseja configurar os secrets agora? (y/n) " -n 1 -r
    echo ""
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deploy cancelado"
        echo ""
        print_info "Você pode configurar os secrets manualmente com:"
        for secret in "${MISSING_SECRETS[@]}"; do
            echo "  firebase functions:secrets:set $secret"
        done
        exit 0
    fi

    # Configurar cada secret
    for secret in "${MISSING_SECRETS[@]}"; do
        echo ""
        print_info "Configurando $secret..."
        echo ""

        # Mostrar onde obter o valor
        case $secret in
            "OPENAI_API_KEY")
                echo "📝 Obtenha sua chave em: https://platform.openai.com/api-keys"
                echo "   A chave começa com: sk-proj-..."
                ;;
            "ZAPI_INSTANCE")
                echo "📝 Obtenha no dashboard do Z-API (Instance ID)"
                ;;
            "ZAPI_TOKEN")
                echo "📝 Obtenha no dashboard do Z-API (Token)"
                ;;
            "ZAPI_CLIENT_TOKEN")
                echo "📝 Obtenha no dashboard do Z-API (Client Token)"
                ;;
        esac
        echo ""

        # Configurar o secret
        if firebase functions:secrets:set "$secret"; then
            print_success "$secret configurado com sucesso"
        else
            print_error "Erro ao configurar $secret"
            exit 1
        fi
    done

    echo ""
    print_success "Todos os secrets foram configurados!"
fi

echo ""
print_info "Instalando dependências..."
npm install

print_success "Dependências instaladas"

echo ""
print_info "Executando lint..."
npm run lint

print_success "Lint passou"

echo ""
print_info "Compilando TypeScript..."
npm run build

print_success "Código compilado"

echo ""
print_info "Iniciando deploy..."
echo ""

# Fazer deploy
firebase deploy --only functions

echo ""
print_success "Deploy concluído com sucesso!"
echo ""
print_info "Para ver os logs:"
echo "  firebase functions:log"
echo ""
print_info "Para ver as functions deployadas:"
echo "  firebase functions:list"
echo ""


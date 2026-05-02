#!/bin/bash

CURRENT=$(node -p "require('./package.json').version")
echo "📦 Versão atual: $CURRENT"

echo ""
echo "Qual tipo de bump?"
echo "1) patch  (1.1.0 → 1.1.1) — bugfix"
echo "2) minor  (1.1.0 → 1.2.0) — feature nova"
echo "3) major  (1.1.0 → 2.0.0) — breaking change"
echo ""
read -p "Escolha [1/2/3]: " CHOICE

case $CHOICE in
  1) TYPE="patch" ;;
  2) TYPE="minor" ;;
  3) TYPE="major" ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

NEW_VERSION=$(npm version $TYPE --no-git-tag-version)
echo ""
echo "✅ Versão atualizada: $CURRENT → $NEW_VERSION"

git add package.json package-lock.json

read -p "💬 Mensagem do commit: " MSG

git commit -m "chore(release): $NEW_VERSION — $MSG"
git tag $NEW_VERSION

echo ""
echo "🏷️  Tag criada: $NEW_VERSION"
echo "📤 Para enviar: git push && git push --tags"

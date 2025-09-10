#!/bin/bash

echo "🌐 Setting up MediMate - Doctor-Patient Communication System..."
set -e

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM="Linux";;
    Darwin*)    PLATFORM="Mac";;
    MINGW*|MSYS*|CYGWIN*) PLATFORM="Windows";;
    *)          echo "❌ Unsupported OS: $OS"; exit 1;;
esac
echo "🖥️ Detected OS: $PLATFORM"

# ---------------- Backend Setup ----------------
echo "📦 Setting up backend..."
cd backend

# Check Python
if ! command -v python3 &>/dev/null; then
    echo "❌ Python3 not found. Please install it."
    exit 1
fi

# Create venv
python3 -m venv .venv
if [ "$PLATFORM" = "Windows" ]; then
    .venv/Scripts/activate
else
    source .venv/bin/activate
fi

# Upgrade pip & install dependencies
pip install --upgrade pip
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found."
    exit 1
fi
pip install -r requirements.txt

# Run migrations
python manage.py migrate

cd ..

# ---------------- Frontend Setup ----------------
echo "🎨 Setting up frontend..."
cd frontend
if command -v pnpm &>/dev/null; then
    pnpm install
elif command -v npm &>/dev/null; then
    npm install
else
    echo "❌ Neither pnpm nor npm found. Please install one of them."
    exit 1
fi
cd ..

echo "✅ Setup complete!"
echo ""
echo "👉 To start backend:"
echo "   cd backend && source .venv/bin/activate && python manage.py runserver"
echo ""
echo "👉 To start frontend:"
echo "   cd frontend && pnpm dev   # or: npm run dev"

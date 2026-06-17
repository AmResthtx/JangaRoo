#!/bin/bash

# Quick start script for self-hosted n8n with Houston Foundation Issues workflow

echo "🚀 Starting self-hosted n8n..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the JangaRoo directory."
    exit 1
fi

# Create workflows directory if it doesn't exist
mkdir -p workflows

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for n8n to start
echo ""
echo "⏳ Waiting for n8n to start..."
sleep 5

# Check health
echo "🔍 Checking n8n status..."
for i in {1..30}; do
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        echo "✅ n8n is ready!"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 Self-hosted n8n is running!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📱 Access n8n at: http://localhost:5678"
        echo ""
        echo "📝 Next steps:"
        echo "   1. Create your n8n account"
        echo "   2. Go to Settings → Credentials"
        echo "   3. Add API keys for:"
        echo "      - Anthropic API"
        echo "      - Firecrawl API"
        echo "      - Twitter/X API"
        echo "      - Reddit API"
        echo "      - Facebook API"
        echo "      - Instagram API"
        echo "   4. Import workflow: n8n-houston-foundation-issues-workflow.json"
        echo "   5. Test and activate"
        echo ""
        echo "📚 Documentation:"
        echo "   - Setup Guide: SELF_HOSTED_N8N_SETUP.md"
        echo "   - Workflow Config: WORKFLOW_CONFIGURATION.md"
        echo "   - API Setup: N8N_SETUP_GUIDE.md"
        echo ""
        echo "🛑 Stop n8n with: docker-compose down"
        echo "📊 View logs with: docker-compose logs -f n8n"
        echo ""
        exit 0
    fi
    echo "   Attempt $i/30... waiting for n8n to be ready"
    sleep 1
done

echo "❌ n8n failed to start. Check logs with: docker-compose logs n8n"
exit 1

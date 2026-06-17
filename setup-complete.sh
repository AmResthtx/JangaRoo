#!/bin/bash

#############################################################################
# N8N Houston Foundation Issues - Complete Automated Setup
# This script handles the entire setup process
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_error() {
    echo -e "${RED}✗${NC}  $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

# Main setup
print_header "N8N Houston Foundation Issues - Complete Setup"

# Step 1: Check requirements
print_header "Step 1: Checking Requirements"

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
print_step "Docker is installed: $(docker --version)"

if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed"
    echo "Please install Docker Compose or update Docker"
    exit 1
fi
print_step "Docker Compose is installed"

# Step 2: Start n8n
print_header "Step 2: Starting N8N Container"

print_info "Starting n8n service..."
docker compose up -d

print_info "Waiting for n8n to start..."
sleep 10

# Check if n8n is ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        print_step "N8N is ready!"
        break
    fi
    echo -ne "\rAttempt $attempt/$max_attempts... waiting for n8n"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    print_error "N8N failed to start. Check logs with: docker compose logs n8n"
    exit 1
fi

print_header "Step 3: Setup Instructions"

echo -e "${YELLOW}IMPORTANT: Complete these steps manually in your browser:${NC}"
echo ""
echo "1. Open: ${BLUE}http://localhost:5678${NC}"
echo ""
echo "2. Create Account (sign up with email and password)"
echo ""
echo "3. Get API Keys (open these in new tabs):"
echo "   - Anthropic: ${BLUE}https://console.anthropic.com${NC}"
echo "   - Firecrawl: ${BLUE}https://www.firecrawl.dev${NC}"
echo "   - Twitter: ${BLUE}https://developer.twitter.com${NC}"
echo "   - Reddit: ${BLUE}https://www.reddit.com/prefs/apps${NC}"
echo "   - Facebook: ${BLUE}https://developers.facebook.com${NC}"
echo ""
echo "4. In n8n, go to Settings → Credentials and add:"
echo "   ${YELLOW}• Anthropic API${NC}"
echo "   ${YELLOW}• Firecrawl API${NC}"
echo "   ${YELLOW}• Twitter OAuth2${NC}"
echo "   ${YELLOW}• Reddit OAuth2${NC}"
echo "   ${YELLOW}• Facebook OAuth2${NC}"
echo "   ${YELLOW}• Instagram${NC}"
echo ""
echo "5. Import workflow:"
echo "   - Click ${BLUE}+${NC} (New)"
echo "   - Click ${BLUE}Import${NC}"
echo "   - Upload: ${BLUE}n8n-houston-foundation-issues-workflow.json${NC}"
echo ""
echo "6. Test the workflow:"
echo "   - Click ${BLUE}Test Workflow${NC}"
echo "   - Verify posts appear in preview"
echo ""
echo "7. Activate:"
echo "   - Click ${BLUE}Activate${NC}"
echo "   - Workflow will run daily"
echo ""

print_header "Setup Status"

echo -e "${GREEN}✓ N8N is running at: http://localhost:5678${NC}"
echo ""
echo "📋 Quick Reference:"
echo "   - View logs:        docker compose logs -f n8n"
echo "   - Stop n8n:         docker compose down"
echo "   - Restart n8n:      docker compose restart n8n"
echo "   - Backup data:      docker compose exec n8n tar czf /tmp/backup.tar.gz -C /home/node/.n8n ."
echo ""
echo -e "${YELLOW}Next: Open http://localhost:5678 in your browser${NC}"
echo ""

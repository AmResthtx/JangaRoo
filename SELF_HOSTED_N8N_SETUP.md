# Self-Hosted n8n Setup Guide

This guide covers deploying a self-hosted n8n instance using Docker. You'll have full control, no recurring costs, and can keep all data on your own infrastructure.

## Prerequisites

- Docker & Docker Compose installed
- A server/machine to run n8n (can be local, VPS, or cloud VM)
- Basic command line knowledge
- Port 5678 available (or change in config)

## Option 1: Quick Start with Docker Compose (Recommended)

### Step 1: Create Project Directory

```bash
mkdir n8n-self-hosted
cd n8n-self-hosted
```

### Step 2: Create docker-compose.yml

Create a file named `docker-compose.yml`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_TUNNEL_URL=http://localhost:5678/
      - GENERIC_TEMP_DIR=/home/node/.n8n/temp
      - TZ=America/Chicago  # Change to your timezone
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows  # Mount workflows folder
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

volumes:
  n8n_data:
    driver: local
```

### Step 3: Start n8n

```bash
docker-compose up -d
```

Wait a moment for the container to start, then access n8n:
- **URL**: `http://localhost:5678`
- **First login**: You'll be prompted to create an account

### Step 4: Verify It's Running

```bash
docker-compose logs -f n8n
# You should see "n8n ready on http://0.0.0.0:5678"
```

## Option 2: Docker Run (Simple, Single Command)

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=0.0.0.0 \
  -e N8N_PORT=5678 \
  -v n8n_data:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n:latest
```

Then access at `http://localhost:5678`

---

## Option 3: Deploy to VPS/Cloud Server

### For DigitalOcean/Linode/AWS EC2:

1. **SSH into your server**
```bash
ssh root@your_server_ip
```

2. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Create n8n directory**
```bash
mkdir -p /opt/n8n
cd /opt/n8n
```

4. **Create docker-compose.yml** (same as above)

5. **Start n8n**
```bash
docker-compose up -d
```

6. **Access n8n** via `http://your_server_ip:5678`

---

## Production Setup with HTTPS & SSL

For production use, add Nginx reverse proxy with SSL:

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://n8n:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Updated docker-compose.yml (with Nginx + SSL)

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "127.0.0.1:5679:5678"  # Only internal access
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - N8N_SECURE_COOKIE=true
      - WEBHOOK_TUNNEL_URL=https://your-domain.com/
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped
    networks:
      - n8n-network

  nginx:
    image: nginx:alpine
    container_name: n8n-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl  # SSL certificates
    depends_on:
      - n8n
    restart: unless-stopped
    networks:
      - n8n-network

volumes:
  n8n_data:

networks:
  n8n-network:
```

### Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx -y

# Generate certificate
certbot certonly --standalone -d your-domain.com

# Update nginx.conf to use SSL
# Copy certificate paths to nginx.conf
```

---

## Step 5: Import Your Workflow

1. **Access n8n**: Open `http://localhost:5678` in browser
2. **Create account**: Sign up with email/password
3. **Import workflow**:
   - Click **"+"** (New)
   - Click **"Import"**
   - Upload `n8n-houston-foundation-issues-workflow.json`
   - Click **"Import"**

---

## Step 6: Configure API Credentials

### Add Anthropic API

1. In n8n, go to **Settings** → **Credentials**
2. Click **"Create New Credential"** → **"Anthropic API"**
3. Paste your Anthropic API key
4. Save

### Add Other Credentials

Repeat for:
- Google Search API
- Firecrawl API
- Twitter API
- Reddit API
- Facebook API
- Instagram API

---

## Database Configuration (Optional but Recommended)

By default, n8n uses SQLite (file-based). For production, use PostgreSQL:

### Updated docker-compose.yml with PostgreSQL

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: your_secure_password_here
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - n8n-network

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=your_secure_password_here
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - n8n-network

volumes:
  n8n_data:
  postgres_data:

networks:
  n8n-network:
```

---

## Maintenance & Management

### View Logs

```bash
docker-compose logs -f n8n
```

### Restart n8n

```bash
docker-compose restart n8n
```

### Stop n8n

```bash
docker-compose down
```

### Update n8n to Latest Version

```bash
docker-compose pull
docker-compose up -d
```

### Backup Your Data

```bash
# Backup n8n data volume
docker run --rm \
  -v n8n_data:/home/node/.n8n \
  -v $(pwd):/backup \
  busybox tar czf /backup/n8n_backup.tar.gz -C /home/node/.n8n .
```

### Restore from Backup

```bash
docker run --rm \
  -v n8n_data:/home/node/.n8n \
  -v $(pwd):/backup \
  busybox tar xzf /backup/n8n_backup.tar.gz -C /home/node/.n8n
```

---

## Troubleshooting

### n8n Won't Start

```bash
docker-compose logs n8n
```

Check for:
- Port 5678 already in use: Change port in docker-compose.yml
- Insufficient disk space
- Memory issues

### Can't Access from External IP

1. Check firewall allows port 5678
2. In production, use reverse proxy (Nginx)
3. Update N8N_HOST if needed

### Workflows Not Running on Schedule

1. Check n8n logs for errors
2. Verify execution history in n8n UI
3. Check system timezone matches your expected time

### Webhooks Not Working

- In docker-compose.yml, set:
  ```yaml
  WEBHOOK_TUNNEL_URL=http://your_server_ip:5678/
  ```
- Or use ngrok for local development:
  ```yaml
  WEBHOOK_TUNNEL_URL=https://your-ngrok-url/
  ```

---

## Cost Comparison

| Aspect | n8n Cloud | Self-Hosted |
|--------|-----------|------------|
| Monthly Cost | $20-100+ | $0-15 (VPS) |
| Data Privacy | Hosted by n8n | Your infrastructure |
| Customization | Limited | Unlimited |
| Backups | n8n manages | You manage |
| Scaling | Auto | Manual |
| Setup Time | 5 minutes | 30-45 minutes |

---

## Environment Variables Reference

```yaml
# Basic
N8N_HOST: IP to bind to (default: 0.0.0.0)
N8N_PORT: Port to run on (default: 5678)
N8N_PROTOCOL: http or https
NODE_ENV: development or production

# Security
N8N_SECURE_COOKIE: true for HTTPS
JWT_SECRET: Custom secret for JWT tokens
N8N_AUTH_EXCLUDE_ENDPOINTS: Exclude endpoints from auth

# Database
DB_TYPE: sqlite, postgresdb, mysqldb
DB_POSTGRESDB_HOST: PostgreSQL host
DB_POSTGRESDB_PORT: PostgreSQL port (default: 5432)
DB_POSTGRESDB_DATABASE: Database name
DB_POSTGRESDB_USER: Database user
DB_POSTGRESDB_PASSWORD: Database password

# Webhooks
WEBHOOK_TUNNEL_URL: URL for webhooks (important for external access)

# Timezone
TZ: Your timezone (e.g., America/Chicago)
```

---

## Next Steps

1. ✅ Set up self-hosted n8n using Docker
2. ✅ Import the Houston Foundation Issues workflow
3. ✅ Configure all API credentials
4. ✅ Test the workflow
5. ✅ Set schedule (daily posting)
6. ✅ Monitor execution history
7. ✅ Set up automated backups
8. ✅ (Optional) Add monitoring/alerts

---

## Resources

- [n8n Official Docker Documentation](https://docs.n8n.io/hosting/installation/docker/)
- [n8n Environment Variables](https://docs.n8n.io/configuration/configuration-via-env-var/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [n8n Community Forum](https://community.n8n.io/)

## Support

For issues:
1. Check n8n documentation
2. Review logs: `docker-compose logs n8n`
3. Check n8n community forum
4. Verify credentials and API keys are correct

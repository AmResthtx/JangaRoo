# Quick Start Guide - Complete Setup in 30 Minutes

This is the fastest path to getting your Houston Foundation Issues automated posting system live.

## 📋 Prerequisites (5 minutes)

- [ ] Docker & Docker Compose installed
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version && docker compose version`

## 🚀 Step 1: Start n8n (2 minutes)

Clone the repository and start n8n:

```bash
git clone https://github.com/AmResthtx/JangaRoo.git
cd JangaRoo
chmod +x setup-complete.sh
./setup-complete.sh
```

Or manually:
```bash
docker compose up -d
```

Wait for the output:
```
✅ N8N is ready!
📱 Access n8n at: http://localhost:5678
```

## 🔑 Step 2: Collect API Keys (15 minutes)

Use the guide: [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)

Quick list (open in browser tabs):
1. **Anthropic** → https://console.anthropic.com → API Keys
2. **Firecrawl** → https://www.firecrawl.dev → Sign up
3. **Twitter** → https://developer.twitter.com → Create App
4. **Reddit** → https://www.reddit.com/prefs/apps → Create App
5. **Facebook** → https://developers.facebook.com → Create App
6. **Instagram** → Link to Facebook Business account

Detailed instructions: See [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for each service

## 🔧 Step 3: Set Up n8n (8 minutes)

### 3.1 Access n8n
Open: http://localhost:5678

### 3.2 Create Account
Sign up with your email and password

### 3.3 Add Credentials

Go to **Settings** → **Credentials** → **+ Create New**

Add credentials for:
- [ ] **Anthropic API** - Paste your API key
- [ ] **Firecrawl API** - Paste your API key
- [ ] **Twitter OAuth2 API** - Complete OAuth flow
- [ ] **Reddit OAuth2 API** - Complete OAuth flow
- [ ] **Facebook OAuth2 API** - Complete OAuth flow
- [ ] **Instagram** - Complete OAuth flow

### 3.4 Import Workflow

1. Click **"+"** (New Workflow)
2. Click **"Import"**
3. Upload file: `n8n-houston-foundation-issues-workflow.json`
4. Click **"Import"**

## ✅ Step 4: Test & Activate (5 minutes)

### 4.1 Test the Workflow
1. Click **"Test Workflow"** button
2. Wait for execution to complete
3. You should see:
   - ✅ Search results from web
   - ✅ Content extracted by Firecrawl
   - ✅ AI-generated posts for all 4 platforms
   - ✅ Posts sent to all platforms

### 4.2 Check Your Social Media
You should see new posts on:
- [ ] Twitter
- [ ] Reddit (r/houston)
- [ ] Facebook
- [ ] Instagram

### 4.3 Activate for Daily Posting
1. Click **"Activate"** button
2. The workflow will now run daily at midnight
3. You'll see the schedule indicator showing "Active"

---

## 🎉 You're Done!

Your automated Houston Foundation Issues posting system is now:
- ✅ Running
- ✅ Posting daily to 4 platforms
- ✅ Generating AI-powered content
- ✅ Extracting web content automatically

### Daily Workflow
Every day at midnight, the system will:
1. Search for Houston foundation/sinkhole news
2. Extract article content
3. Generate 4 social media posts
4. Post to Twitter, Reddit, Facebook, Instagram
5. Send you a Slack notification (optional)

---

## 📚 Full Documentation

- **Detailed Setup**: [SELF_HOSTED_N8N_SETUP.md](./SELF_HOSTED_N8N_SETUP.md)
- **API Keys Guide**: [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
- **Workflow Config**: [WORKFLOW_CONFIGURATION.md](./WORKFLOW_CONFIGURATION.md)
- **n8n Setup**: [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)

---

## 🆘 Quick Troubleshooting

### n8n won't start
```bash
docker compose logs n8n
# Check for Docker issues or port conflicts
```

### Credentials invalid
- Copy API keys carefully (no extra spaces)
- Verify keys haven't expired
- Check character limits and format

### Posts not appearing on social media
- Verify credentials are still valid (some expire)
- Check rate limits (Twitter/Reddit have limits)
- Review n8n execution logs for errors

### Need to stop/restart
```bash
# Stop n8n
docker compose down

# Restart n8n
docker compose restart n8n

# View logs
docker compose logs -f n8n
```

---

## 🎯 What Happens Next

### Daily (Automated)
- System searches for Houston foundation issues
- Extracts content from articles
- Generates platform-specific posts
- Posts to all 4 social media platforms

### Weekly (Manual)
- Review posts and engagement
- Adjust content if needed
- Monitor for issues

### Monthly (Optional)
- Backup your data
- Review analytics
- Adjust search topics if desired

---

## 📞 Support

If something doesn't work:

1. Check [SELF_HOSTED_N8N_SETUP.md](./SELF_HOSTED_N8N_SETUP.md) troubleshooting section
2. Review [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for credential issues
3. Check n8n logs: `docker compose logs n8n`
4. Visit n8n community: https://community.n8n.io

---

## ✨ Next Level (Optional)

Once you have the basic system running, consider:

- **Add more topics**: Create multiple workflows for different topics
- **Add images**: Integrate DALL-E or Midjourney for image generation
- **Add RSS feeds**: Monitor specific news sources automatically
- **Analytics**: Track post performance and engagement
- **Scheduling**: Post at optimal times for each platform
- **Database**: Store all posts and analytics in PostgreSQL

See [WORKFLOW_CONFIGURATION.md](./WORKFLOW_CONFIGURATION.md) for details.

---

**Estimated time to first live post: 30 minutes**

Good luck! 🚀

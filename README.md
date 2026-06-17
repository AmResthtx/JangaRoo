# JangaRoo: Automated Houston Foundation Issues Content Distribution

An n8n-based automation system that searches the web for Houston foundation issues (specifically monitoring the Bammel North Houston sinkhole situation), extracts relevant content, generates engaging social media posts using Claude AI, and automatically posts to Twitter, Reddit, Facebook, and Instagram daily.

## 🚀 Features

- **Automated Web Search**: Daily searches for Houston foundation issues and sinkhole news
- **Content Extraction**: Uses Firecrawl to extract and clean web content
- **AI-Generated Posts**: Claude creates platform-optimized content for each social network
- **Multi-Platform Publishing**: Automatically posts to Twitter, Reddit, Facebook, and Instagram
- **Daily Schedule**: Configured to run once daily (customizable)
- **Error Monitoring**: Slack notifications for workflow execution status

## 📋 Project Structure

```
JangaRoo/
├── n8n-houston-foundation-issues-workflow.json    # n8n workflow definition
├── N8N_SETUP_GUIDE.md                            # Complete setup instructions
├── README.md                                      # This file
└── LICENSE
```

## 🎯 Use Case

Perfect for:
- **Local News Aggregation**: Automatically share Houston foundation/sinkhole updates
- **Community Awareness**: Keep residents informed about foundation issues
- **Real Estate Professionals**: Stay updated on property-related news
- **Government/Engineering Firms**: Monitor infrastructure issues
- **Content Marketing**: Automated content distribution across multiple platforms

## 📦 What You Get

1. **n8n Workflow File** - Ready to import into n8n
2. **Docker Setup** - Complete docker-compose.yml for self-hosting
3. **Setup Guides**:
   - Self-Hosted Setup (Docker) - Full control, no costs
   - Cloud Setup (n8n.io) - Quick and easy
   - Workflow Configuration - Advanced customization
4. **Automated Pipeline** that handles:
   - Web searching
   - Content extraction
   - AI-powered writing
   - Multi-platform publishing
   - Notifications

## 💻 System Requirements

### Self-Hosted (Docker)
- Docker & Docker Compose installed
- 1GB RAM minimum
- 500MB disk space
- Internet connection
- Local machine, VPS, or cloud server

### Cloud (n8n.io)
- Web browser
- Internet connection
- No installation needed

## 🔧 Quick Start

### Option 1: Self-Hosted (Recommended) 🏠
No recurring costs, full control, data privacy

```bash
# 1. Clone the repo and navigate to directory
cd JangaRoo

# 2. Start n8n with Docker (requires Docker to be installed)
./start-n8n.sh
# or: docker-compose up -d

# 3. Access n8n
# Open http://localhost:5678 in your browser

# 4. Create account and import workflow
# Import: n8n-houston-foundation-issues-workflow.json

# 5. Add API credentials (see below)
# 6. Test and activate
```

See [SELF_HOSTED_N8N_SETUP.md](./SELF_HOSTED_N8N_SETUP.md) for detailed instructions.

### Option 2: Cloud-Hosted (n8n.io)
Quick setup, no infrastructure needed

1. Create a free account at [n8n.io](https://n8n.io)
2. Import the workflow: `n8n-houston-foundation-issues-workflow.json`
3. Follow the [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) to configure API credentials
4. Test and activate the workflow
5. Monitor posts on your social media accounts

## 📱 Supported Platforms

- **Twitter/X** - 280 character posts with hashtags
- **Reddit** - Posts to r/houston with titles and descriptions
- **Facebook** - Page posts with engagement-optimized copy
- **Instagram** - Captions with relevant hashtags

## 🔑 Required API Keys

- Anthropic API (Claude)
- Firecrawl API
- Google Search API
- Twitter Developer Credentials
- Reddit Developer Credentials
- Facebook Graph API
- Instagram Business API

Detailed instructions for obtaining each in the setup guide.

## ⚙️ Customization

The workflow is fully customizable:
- **Search Query**: Modify what topics are searched
- **Posting Schedule**: Change frequency (daily, twice daily, weekly, etc.)
- **Content Style**: Adjust AI prompts for different tones or formats
- **Data Sources**: Add RSS feeds, webhooks, or other sources
- **Post Timing**: Set specific times for each platform

## 📊 Monitoring

- View execution history in n8n Dashboard
- Receive Slack notifications on successful posts
- Track engagement on individual social media platforms
- Adjust content based on performance metrics

## 🎓 Educational Use

This project demonstrates:
- API integrations (9+ different services)
- Workflow automation principles
- AI content generation (Claude)
- Web scraping best practices (Firecrawl)
- Social media automation
- Scheduled automation with n8n

## 🛡️ Responsible Use

- Ensure you have permission to post on all accounts
- Respect social media platform Terms of Service
- Monitor posting frequency to avoid rate limits
- Verify content accuracy before automatic posting
- Follow guidelines for automated posting on each platform

## 🆘 Support & Troubleshooting

See [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) for:
- Step-by-step setup instructions
- Troubleshooting common issues
- Advanced customization options
- Credential configuration for each platform

## 📝 License

See LICENSE file for details.

## 🚀 Next Steps

After setup:
1. Monitor initial posts for quality and accuracy
2. Fine-tune the Claude prompt for your preferred style
3. Expand to other Houston-area topics
4. Add image generation capabilities
5. Integrate additional data sources
6. Track and analyze post performance

---

**Status**: Ready for n8n import and configuration

For questions or issues, refer to the detailed [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md).

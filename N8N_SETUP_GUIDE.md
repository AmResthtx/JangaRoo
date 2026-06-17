# N8N Workflow Setup Guide: Houston Foundation Issues Auto-Poster

This workflow automatically searches for Houston foundation issues (specifically Bammel North Houston sinkhole news), extracts content using Firecrawl, generates engaging social media posts with Claude AI, and posts to Twitter, Reddit, Facebook, and Instagram daily.

## Prerequisites

1. **n8n Account**: Create a free account at [n8n.io](https://n8n.io) or self-host n8n
2. **API Keys Required**:
   - Anthropic API key (for Claude)
   - Google Search API key (or use n8n's built-in search)
   - Firecrawl API key
   - Twitter/X API credentials
   - Reddit API credentials
   - Facebook API credentials
   - Instagram API credentials

## Step 1: Create n8n Account

1. Go to [n8n.io](https://n8n.io)
2. Click "Sign up"
3. Complete the registration process
4. Verify your email

## Step 2: Import the Workflow

1. In your n8n workspace, click **"+ New"** → **"Workflow"**
2. Click the three-dot menu in the top-right
3. Select **"Import from File"** or **"Import from URL"**
4. Upload the `n8n-houston-foundation-issues-workflow.json` file
5. Click **"Import"**

## Step 3: Configure Credentials

### 3.1 Anthropic API (Claude)

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create or copy your API key
3. In n8n, click the **"Anthropic"** node
4. Click **"Create New Credential"** → **"Anthropic API"**
5. Paste your API key
6. Save and test

### 3.2 Firecrawl API

1. Go to [Firecrawl](https://www.firecrawl.dev) and sign up
2. Copy your API key
3. In n8n, select the **"HTTP Request"** node (Firecrawl Extract Content)
4. Add authorization header: `Authorization: Bearer YOUR_FIRECRAWL_KEY`
5. Update the URL to use Firecrawl's API endpoint:
   ```
   https://api.firecrawl.dev/v0/scrape
   ```

### 3.3 Twitter/X API

1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create an app and get API credentials
3. In n8n, click **"Twitter"** node
4. Select **"Create New Credential"** → **"Twitter OAuth2 API"**
5. Complete OAuth flow
6. Save

### 3.4 Reddit API

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new application
3. Get Client ID and Client Secret
4. In n8n, click **"Reddit"** node
5. Select **"Create New Credential"** → **"Reddit OAuth2 API"**
6. Enter credentials and complete OAuth
7. Save

### 3.5 Facebook API

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app
3. Set up Page Access Token
4. In n8n, click **"Facebook"** node
5. Select **"Create New Credential"** → **"Facebook OAuth2 API"**
6. Complete OAuth flow
7. Save

### 3.6 Instagram API

1. Use your Facebook app (Instagram Business accounts are managed through Facebook)
2. Get your Instagram Business Account ID and Access Token
3. In n8n, click **"Instagram"** node
4. Configure with your Access Token
5. Save

### 3.7 Environment Variables

1. In n8n Workflows settings, add these environment variables:
   ```
   FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token
   ```

## Step 4: Customize the Workflow

### Change Search Query

1. Click the **"Search Web"** node
2. Modify the `query` parameter to search for different topics:
   ```
   Houston foundation issues Bammel North sinkhole 2024 2025
   ```
   You can change this to:
   - `Houston foundation repair costs`
   - `Texas subsidence sinkhole news`
   - Etc.

### Change Posting Schedule

1. Click the **"Schedule Trigger"** node
2. Modify the schedule:
   - **Every day** (current): `trigger: "every"`, `unit: "day"`, `value: 1`
   - **Twice daily**: `value: 0.5` (every 12 hours)
   - **Every 3 days**: `value: 3`
   - **Weekly**: `unit: "week"`, `value: 1`

### Customize Content Generation

1. Click the **"Generate Social Posts"** node
2. Modify the prompt to change tone, hashtags, or content style
3. Add brand voice or specific guidelines

## Step 5: Test the Workflow

1. Click **"Test Workflow"** (or use the play button)
2. The workflow will:
   - Search for the latest Houston foundation issues
   - Extract content from the top result
   - Generate 4 social media posts
   - Post to all platforms
   - Send a Slack notification (optional)

## Step 6: Activate the Workflow

1. Click **"Activate"** in the top-right corner
2. The workflow will run daily at midnight (or your configured time)
3. Check n8n Dashboard for execution logs

## Monitoring & Maintenance

### View Execution History
1. Click **"Executions"** tab
2. Check success/failure status
3. View logs for debugging

### Common Issues

**Issue**: Posts not appearing on social media
- **Solution**: Check credentials are valid and not expired. Re-authorize if needed.

**Issue**: No search results found
- **Solution**: Modify the search query to be more specific or general

**Issue**: Rate limits exceeded
- **Solution**: Increase the schedule interval (post less frequently)

## Advanced: Add More Data Sources

You can enhance the workflow to:
1. Monitor RSS feeds of local Houston news
2. Track trending hashtags about foundation issues
3. Aggregate multiple sources before posting
4. Include images/videos with posts

## Scheduled Posting Times

Current setup posts daily. To adjust:
- **Morning (9 AM)**: Set trigger hour to 9
- **Evening (6 PM)**: Set trigger hour to 18
- **Multiple times**: Create separate workflow instances

## Support

For issues:
1. Check n8n documentation: [docs.n8n.io](https://docs.n8n.io)
2. Verify API credentials are valid
3. Check rate limits on social media APIs
4. Review n8n execution logs for detailed errors

## Next Steps

After setup:
1. Monitor the first few posts for quality
2. Adjust content generation prompt based on results
3. Add analytics to track post performance
4. Consider adding image generation (DALL-E, Midjourney, etc.)
5. Expand to other Houston-area topics

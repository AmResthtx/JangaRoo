# Workflow Configuration Reference

This document provides detailed configuration options for the Houston Foundation Issues Auto-Poster workflow.

## 1. Search Configuration

### Current Setup
```json
{
  "resource": "search",
  "searchEngineType": "google",
  "query": "Houston foundation issues Bammel North sinkhole 2024 2025",
  "limit": 5
}
```

### Search Query Examples

**Foundation Issues:**
- `Houston foundation damage settlement issues`
- `Houston foundation repair cost estimates`
- `Texas subsidence and sinkhole updates`

**Location-Specific:**
- `Bammel North Houston sinkhole news`
- `Katy Texas foundation problems`
- `Sugar Land foundation issues`

**Real Estate Focus:**
- `Houston real estate foundation inspection requirements`
- `Foundation repair affects home value Houston`
- `Texas foundation disclosure laws`

**News-Based:**
- `Houston foundation crisis latest news`
- `Texas infrastructure sinkhole reports`
- `Foundation insurance claims Houston`

### Adjust Search Results Limit

Change `"limit": 5` to:
- `2-3` - Only top results (faster, more focused)
- `5-10` - Good balance (current)
- `15-20` - Comprehensive search (slower)

---

## 2. Content Extraction (Firecrawl)

### Default Configuration
```
Endpoint: https://api.firecrawl.dev/v0/scrape
Method: POST
Headers: Authorization: Bearer YOUR_FIRECRAWL_API_KEY
```

### Request Body
```json
{
  "url": "{{ $node['Search Web'].json.results[0].link }}",
  "formats": ["markdown"],
  "onlyMainContent": true,
  "waitFor": 3000
}
```

### Optional Parameters
- `includeTags`: Specify HTML tags to extract
- `excludeTags`: Exclude certain elements
- `timeout`: Increase if pages are slow to load (default: 30000ms)
- `proxy`: Use proxy if needed in your region

---

## 3. Claude AI Content Generation

### Current Prompt
```
Based on this content about Houston foundation issues: {{ $node['Firecrawl Extract Content'].json.content }}

Generate 4 engaging social media posts (one for each platform: Twitter/X, Reddit, Facebook, Instagram). 
Make them informative, compelling, and platform-appropriate. 
Format as JSON with keys: twitter, reddit, facebook, instagram. 
Keep Twitter under 280 characters. 
Add relevant hashtags for each platform.
```

### Prompt Variations

**More Professional/Technical:**
```
Based on this Houston foundation news: {{ content }}

Create 4 professional social media posts for industry professionals (engineers, real estate agents, contractors).
Focus on technical details and implications.
Format as JSON with keys: twitter, reddit, facebook, instagram.
Include relevant industry hashtags.
```

**More Casual/Community:**
```
Based on this Houston foundation update: {{ content }}

Write 4 friendly, conversational social posts for Houston residents.
Make them relatable and informative without being alarmist.
Format as JSON with keys: twitter, reddit, facebook, instagram.
Use emoji appropriately and relevant neighborhood hashtags.
```

**Call-to-Action Focused:**
```
Based on this: {{ content }}

Generate 4 posts that encourage engagement and conversation.
Each should end with a question or call-to-action.
Format as JSON with keys: twitter, reddit, facebook, instagram.
Include CTAs like "Have you experienced this?" or "Share your story in comments."
```

**Educational Focus:**
```
Based on this Houston foundation issue: {{ content }}

Create 4 educational posts that explain the topic to general audiences.
Simplify technical concepts and provide helpful context.
Format as JSON with keys: twitter, reddit, facebook, instagram.
Include links to resources or guides when relevant.
```

### Model Selection

Change from `"model": "claude-opus-4-1"` to:
- `claude-opus-4-1` - Most capable, higher cost
- `claude-sonnet-4-6` - Good balance of quality and cost (recommended)
- `claude-haiku-4-5` - Fastest, lowest cost, adequate for most content

---

## 4. Scheduling Configuration

### Current Setup
```json
{
  "trigger": "every",
  "unit": "day",
  "value": 1
}
```

### Schedule Examples

**Multiple Times Daily**
```json
{
  "trigger": "every",
  "unit": "hours",
  "value": 12  // Twice daily
}
```

**Specific Time of Day**
```json
{
  "trigger": "at",
  "hour": 9,
  "minute": 0
  // Posts at 9:00 AM daily
}
```

**Weekdays Only**
```json
{
  "trigger": "every",
  "unit": "day",
  "value": 1,
  "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```

**Multiple Posts at Different Times**
```json
{
  "trigger": "at",
  "hour": 9,   // 9 AM
  "minute": 0
}
// And create separate trigger for 6 PM
```

---

## 5. Platform-Specific Configurations

### Twitter/X

**Tweet Options:**
- `status`: The tweet text (280 chars max)
- `reply_to_status_id`: Reply to specific tweet
- `in_reply_to_screen_name`: Tag user in reply
- `latitude`/`longitude`: Add location

**Hashtag Strategy:**
- Use 2-4 hashtags per tweet
- Suggested: `#Houston`, `#Foundation`, `#RealEstate`, `#Infrastructure`
- Regional: `#HTown`, `#HoustonArea`, `#TexasNews`

### Reddit

**Post Options:**
- `subreddit`: Currently `houston` - change to:
  - `r/texas` - Broader Texas audience
  - `r/RealEstate` - Real estate focus
  - `r/Houston` - Local Houston community
  - `r/construction` - Construction/engineering
- `title`: Post title (usually auto-generated)
- `text`: Post body content
- `link`: External link (alternative to text)

### Facebook

**Post Options:**
- `message`: Main post text
- `link`: URL to include
- `description`: Link description
- `picture`: Image URL
- `schedule_time`: Schedule future posts

**Best Practices:**
- Include line breaks for readability
- Add 1-2 relevant images
- Use 2-3 hashtags
- Post during high-engagement hours (9-11 AM, 6-8 PM)

### Instagram

**Post Options:**
- `caption`: Post description (2200 char limit)
- `image_url`: Image to post
- `location_id`: Location tag
- `user_tags`: Tag other accounts

**Best Practices:**
- Use 10-30 hashtags
- Include location tag
- Use line breaks and emojis
- Post between 12-3 PM or 6-9 PM
- Suggested hashtags:
  - `#Houston`
  - `#HoustonLife`
  - `#HoustonArea`
  - `#RealEstate`
  - `#HomeInspection`
  - `#FoundationRepair`

---

## 6. Error Handling

### Add Error Node

After each social media posting node, add:

```json
{
  "name": "Handle [Platform] Error",
  "type": "n8n-nodes-base.if",
  "condition": "{{ $json.error }}",
  "thenBranch": [
    {
      "type": "Slack Notification",
      "message": "❌ Failed to post on [Platform]: {{ $json.error }}"
    }
  ],
  "elseBranch": []
}
```

---

## 7. Advanced: Add Image Generation

### Integration with DALL-E

```json
{
  "parameters": {
    "operation": "generate",
    "prompt": "Create an infographic about {{ topic }} foundation issues"
  },
  "name": "Generate Image",
  "type": "n8n-nodes-base.openai"
}
```

### Integration with Midjourney

```json
{
  "parameters": {
    "prompt": "/imagine {{ topic }} foundation issue illustration"
  },
  "name": "Midjourney Image",
  "type": "n8n-nodes-base.httpRequest"
}
```

---

## 8. Database Logging

### Store Posts in Database

Add a database node to track:
- Timestamp
- Search query used
- Generated posts
- Platform responses
- Engagement metrics

```json
{
  "name": "Log to Database",
  "type": "n8n-nodes-base.postgres",
  "operation": "insert",
  "table": "social_posts",
  "columns": {
    "timestamp": "{{ $now }}",
    "source_url": "{{ $node['Search Web'].json.results[0].link }}",
    "twitter_post": "{{ $json.twitter }}",
    "reddit_post": "{{ $json.reddit }}",
    "facebook_post": "{{ $json.facebook }}",
    "instagram_post": "{{ $json.instagram }}"
  }
}
```

---

## 9. Testing Checklist

- [ ] Search returns relevant results
- [ ] Firecrawl extracts clean content
- [ ] Claude generates 4 platform-specific posts
- [ ] All 4 posts are unique and appropriate
- [ ] Twitter post is under 280 characters
- [ ] Hashtags are relevant and recent
- [ ] Posts successfully publish to all platforms
- [ ] Slack notification is received
- [ ] No sensitive information is shared
- [ ] Tone matches your brand

---

## 10. Performance Optimization

### Reduce Execution Time
- Limit search results: `"limit": 2`
- Use faster Claude model: `claude-haiku-4-5`
- Cache successful searches (within 24 hours)

### Cost Optimization
- Use `claude-sonnet-4-6` instead of opus
- Post less frequently (every 3 days vs. daily)
- Batch multiple topics in one post

### Reliability
- Add retry logic for failed API calls
- Use exponential backoff for rate limits
- Log all errors for debugging
- Test credentials monthly

---

## Example: Custom Topic Setup

To post about different Houston topics, create multiple workflows:

**Workflow 1: Foundation Issues**
```json
{
  "query": "Houston foundation issues sinkhole"
}
```

**Workflow 2: Real Estate Market**
```json
{
  "query": "Houston real estate market prices trends"
}
```

**Workflow 3: Infrastructure**
```json
{
  "query": "Houston infrastructure development construction"
}
```

Each runs on different schedules to avoid duplicate posting.

---

For more information, see [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)

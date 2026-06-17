# API Keys Setup Guide

Complete step-by-step instructions for obtaining all required API keys.

## 1. Anthropic API Key (Claude)

### Get the Key
1. Go to: https://console.anthropic.com
2. Click **"Settings"** (left sidebar)
3. Click **"API keys"**
4. Click **"Create Key"**
5. Copy the key (you'll only see it once!)

### Add to n8n
1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Create New"** → **"Anthropic API"**
3. Paste your API key in the **"API Key"** field
4. Click **"Save"**
5. Test the connection

**Cost**: Free tier: $5/month. Affordable for daily posting.

---

## 2. Firecrawl API Key

### Get the Key
1. Go to: https://www.firecrawl.dev
2. Click **"Get Started"** or **"Sign In"**
3. Create account (email/password or OAuth)
4. Go to **Dashboard** → **API Keys**
5. Click **"Create API Key"**
6. Copy the key

### Add to n8n
1. In n8n, create new credential: **"HTTP Basic Auth"**
2. Set header: `Authorization: Bearer YOUR_FIRECRAWL_KEY`
3. Or use the "HTTP Request" node with:
   ```json
   {
     "Authorization": "Bearer YOUR_FIRECRAWL_KEY"
   }
   ```

**Cost**: Free tier available. Good for testing.

---

## 3. Twitter/X API Credentials

### Get the Keys
1. Go to: https://developer.twitter.com/en/dashboard
2. Sign in with your Twitter account
3. Click **"+ Create Project"** (if first time)
   - Project name: "Houston Foundation Issues"
   - Use case: "Content publishing"
   - Description: "Automated content distribution"
4. Click **"+ Create App"**
   - App name: "Houston Foundation Issues"
5. Go to **"Keys and Tokens"** tab
6. Copy:
   - **API Key** (also called Consumer Key)
   - **API Key Secret** (also called Consumer Secret)
7. Scroll to **"Authentication Tokens and Keys"**
8. Click **"Generate"** under "Access Token & Secret"
9. Copy:
   - **Access Token**
   - **Access Token Secret**

### Enable OAuth2
1. In your app, go to **"Settings"** → **"Authentication settings"**
2. Toggle ON: **"OAuth 2.0"**
3. Set Callback URL: `http://localhost:5678/callback`
4. Set Website URL: `http://localhost:5678`
5. Click **"Save"**

### Add to n8n
1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Create New"** → **"Twitter OAuth2 API"**
3. You'll be redirected to Twitter to authorize
4. Complete the OAuth flow
5. n8n will save the credentials automatically

**Cost**: Free tier available (limited posts). Check current API pricing.

**Important**: Make sure your Twitter account has posting enabled.

---

## 4. Reddit API Credentials

### Get the Keys
1. Go to: https://www.reddit.com/prefs/apps
2. Scroll to **"Developed Applications"**
3. Click **"Create an App"** or **"Create Another App"**
4. Fill in:
   - **Name**: "Houston Foundation Issues"
   - **App type**: Select "**script**" (for personal use)
   - **Redirect URI**: `http://localhost:5678`
   - **Description**: "Automated content distribution"
5. Click **"Create App"**
6. Under your app, copy:
   - **ID** (under the app name)
   - **Secret** (click "show")

### Get Your Reddit Username/Password
- Username: Your Reddit account username
- Password: Your Reddit account password
- Device ID: Generate random string (or use: `houston-foundation-issues`)

### Add to n8n
1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Create New"** → **"Reddit OAuth2 API"**
3. You'll be redirected to Reddit to authorize
4. Grant permission to your app
5. n8n will save the credentials automatically

**Cost**: Completely free

**Note**: You need a Reddit account with at least 300+ karma or older than 30 days to post. If you're new, wait or post in r/test first to build karma.

---

## 5. Facebook API Access Token

### Get the Token
1. Go to: https://developers.facebook.com
2. Log in with your Facebook account
3. Click **"Create App"** (if first time)
   - App name: "Houston Foundation Issues"
   - App type: "Business"
   - Use case: "Publish content"
4. Go to **"Settings"** → **"Basic"**
5. Copy your **App ID** and **App Secret**
6. Go to **"Tools"** → **"Graph API Explorer"**
7. Select your app from dropdown (top right)
8. Click **"Generate Access Token"**
9. Grant necessary permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
10. Copy the token
11. In Graph API Explorer, run query:
    ```
    GET /me/accounts
    ```
12. Find your page and copy its **access_token** (this is your Page Access Token)

### Add to n8n
1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Create New"** → **"Facebook OAuth2 API"**
3. You'll be redirected to Facebook to authorize
4. Grant all requested permissions
5. Select your page to manage
6. n8n will save the credentials automatically

**Cost**: Completely free

**Note**: You need to be a page admin to post.

---

## 6. Instagram API Access Token

### Get the Token
1. **Requirement**: You must have a **Facebook Business Account** and an **Instagram Business Account** (not personal)
2. Convert your Instagram to Business Account:
   - Go to Instagram Settings → Account → Switch to Professional Account → Business
   - Link it to your Facebook Page
3. Go to: https://developers.facebook.com
4. Go to **"Tools"** → **"Graph API Explorer"**
5. Run query:
   ```
   GET /me?fields=id,name
   ```
6. Copy your User ID
7. Run query:
   ```
   GET /me/instagram_business_account?fields=id,name,username
   ```
8. Copy your Instagram Business Account ID
9. Generate **Page Access Token** (same as Facebook section above)

### Add to n8n
1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Create New"** → **"Instagram OAuth2 API"**
3. You'll be redirected to Instagram/Facebook to authorize
4. Grant all requested permissions
5. n8n will save the credentials automatically

**Cost**: Completely free

**Note**: 
- Instagram Business accounts post via Facebook API
- Posts may take 24 hours to appear
- You need a Facebook Page + Instagram Business Account linked

---

## 7. Google Search API (Optional)

Only needed if you want to customize search engine. Otherwise, n8n uses built-in search.

### Get the Key (Optional)
1. Go to: https://console.cloud.google.com
2. Create a new project
3. Enable **"Custom Search API"**
4. Go to **"Credentials"** → **"Create Credentials"** → **"API Key"**
5. Copy the API key

### Create Custom Search Engine
1. Go to: https://programmablesearchengine.google.com
2. Create a new search engine
3. Copy your **Search Engine ID**

**Cost**: Free tier: 100 queries/day. $5 per 1000 queries after that.

---

## Summary Checklist

Before starting n8n setup, gather these:

```
Anthropic (Claude)
- [ ] API Key from: https://console.anthropic.com

Firecrawl
- [ ] API Key from: https://www.firecrawl.dev

Twitter/X
- [ ] API Key
- [ ] API Secret
- [ ] Access Token
- [ ] Access Token Secret

Reddit
- [ ] Client ID
- [ ] Client Secret
- [ ] Username
- [ ] Password

Facebook
- [ ] App ID
- [ ] App Secret
- [ ] Page Access Token

Instagram
- [ ] Business Account ID
- [ ] Access Token (same as Facebook)

Google Search (Optional)
- [ ] API Key
- [ ] Search Engine ID
```

---

## Adding Credentials in n8n

1. Open n8n: http://localhost:5678
2. Click **Settings** (top right)
3. Click **Credentials**
4. For each service, click **"+ Create New"**
5. Select the service type
6. Enter your credentials
7. Click **Save**

---

## Testing Credentials

After adding credentials:

1. Click on the workflow node that uses the credential
2. Click **Test Step**
3. If successful, you'll see a green checkmark
4. If failed, you'll see the error (usually "Invalid credentials")

---

## Cost Summary

| Service | Free Tier | Cost for Daily Posts |
|---------|-----------|---------------------|
| Anthropic | $5/month | $5-10/month |
| Firecrawl | 100 pages/month | Free-$20/month |
| Twitter | Basic | Free-$100+/month |
| Reddit | Unlimited | Free |
| Facebook | Unlimited | Free |
| Instagram | Unlimited | Free |
| **Total** | **~$200/month** | **~$10-30/month** |

---

## Troubleshooting

### "Invalid Credentials" Error
- Double-check that you copied the entire key
- No extra spaces or quotes
- Make sure key hasn't expired (some APIs require regeneration)

### OAuth Authorization Fails
- Clear browser cookies
- Try in incognito window
- Check that callback URL matches what's registered with the service

### Posts Not Appearing
- Verify the account has posting permissions
- Check rate limits (some services have daily post limits)
- Look at n8n execution logs for detailed errors

---

## Security Notes

1. **Never commit API keys** to git (they're in .env, which is .gitignored)
2. **Regenerate keys** if accidentally exposed
3. **Rotate keys** every 90 days (best practice)
4. **Use strong passwords** for all service accounts
5. **Enable 2FA** on all service accounts
6. **Review permissions** - only grant what's needed
7. **Monitor usage** - check API dashboards for unusual activity

---

For detailed n8n setup instructions, see: [SELF_HOSTED_N8N_SETUP.md](./SELF_HOSTED_N8N_SETUP.md)

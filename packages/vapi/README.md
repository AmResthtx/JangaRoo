# Vapi AI Phone Assistant

JangaRoo uses [Vapi](https://vapi.ai) for an AI voice agent that handles inbound calls,
answers questions about the studio, and sends callers a booking link by SMS when the call ends.

## Setup

### 1. Create a Vapi account

Sign up at [vapi.ai](https://vapi.ai) and get your **API Key** and **Phone Number**.

### 2. Import the assistant config

Open `assistant-config.json` and replace the `{{placeholders}}`:

| Placeholder | Value |
|---|---|
| `{{studioName}}` | e.g. `Rhythm Dance Studio` |
| `{{bookingUrl}}` | e.g. `https://your-app.com/book/rhythm` |
| `{{contactEmail}}` | e.g. `info@rhythmdance.com` |
| `{{appUrl}}` | Your Next.js app URL (for the webhook) |
| `{{vapiWebhookSecret}}` | A random secret string (store in `.env` as `VAPI_WEBHOOK_SECRET`) |

Then create the assistant via the Vapi dashboard or API:

```bash
curl -X POST https://api.vapi.ai/assistant \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @packages/vapi/assistant-config.json
```

Copy the returned `id` — you'll need it in the next step.

### 3. Assign a phone number

In the Vapi dashboard, go to **Phone Numbers → Buy a number** (or import your Twilio number).
Set the **Inbound Assistant** to the assistant you just created.

### 4. Add env vars

```
VAPI_WEBHOOK_SECRET=your-secret-string
N8N_VAPI_WEBHOOK_URL=https://your-n8n.com/webhook/vapi-sms
```

### 5. Configure n8n for SMS

Create a second n8n workflow (or add a branch to the existing one) that:
1. Listens on webhook path `vapi-sms`
2. Checks `body.action === 'send_booking_sms'`
3. Uses **Twilio** node to send `body.message` to `body.phone`

### 6. Test

Call your Vapi phone number. The AI will answer, answer questions, and after the call
your app will POST to n8n to send an SMS with the booking link.

## How it works

```
Caller dials studio number
        │
        ▼
   Vapi AI agent (Claude Haiku)
   answers, chats, answers FAQs
        │
   Call ends
        │
        ▼
   POST /api/vapi  (end-of-call-report webhook)
        │  if transcript mentions booking
        ▼
   n8n → Twilio SMS → caller's phone
   "Here's your booking link: ..."
```

## Multi-studio

Each studio can have its **own Vapi phone number** pointing to its own assistant config
with that studio's name, booking URL, and contact info.

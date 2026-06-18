# n8n Booking Approval Workflow

This directory contains the n8n workflow that powers the booking approval email notifications for JangaRoo.

## Setup Guide

### Step 1 — Import the workflow into n8n

1. Log in to your n8n instance (self-hosted or n8n.cloud).
2. In the left sidebar, click **Workflows**.
3. Click the **Import** button (top-right area of the workflows list).
4. Select the file `packages/n8n/workflows/booking-approval.json` from this repository.
5. The workflow will be imported in a deactivated state.

### Step 2 — Configure SMTP credentials

1. In n8n, open the imported **Booking Approval** workflow.
2. Click any **Send Email** node (there are four of them).
3. In the node panel, click **Credential for SMTP** → **Create new**.
4. Fill in your SMTP server details (host, port, username, password, TLS settings).
   - For Gmail: use `smtp.gmail.com`, port `587`, and an App Password.
   - For SendGrid: use `smtp.sendgrid.net`, port `587`, user `apikey`, and your API key as password.
5. Click **Save**. n8n will reuse this credential across all Send Email nodes automatically once you select it in each node.

### Step 3 — Optionally configure Twilio (SMS)

If you want SMS notifications:

1. Install the Twilio node package in n8n (if not already installed).
2. Add a **Twilio** node after the approved/rejected switch branches.
3. Configure Twilio credentials (Account SID, Auth Token).
4. Set the **To** field to `{{ $json.body.studentPhone }}` and enable it only when `notifyVia` includes `sms`.
5. In Supabase, set `twilio_enabled = true` for the studio row.

### Step 4 — Activate the workflow

1. In the workflow editor, click the toggle in the top-right corner to switch from **Inactive** to **Active**.
2. n8n will now listen for POST requests on the webhook URL.

### Step 5 — Copy the webhook URL into Supabase

1. Click the **Webhook** trigger node in the workflow.
2. Copy the **Production URL** (not the Test URL).
3. In Supabase SQL Editor, run:

```sql
update studios
set n8n_webhook_url = 'https://your-n8n-instance.com/webhook/booking-event'
where slug = 'rhythm';
```

Replace the URL with your actual webhook URL and the slug with your studio slug.

---

## Workflow Overview

The workflow handles three events sent by the JangaRoo API:

| `action` value | Trigger | What happens |
|---|---|---|
| `new_booking` | Student submits a booking | Manager receives approval email with Approve/Reject links |
| `approved` | Manager clicks Approve | Teacher + Student both receive confirmation emails |
| `rejected` | Manager clicks Reject | Student receives a rejection notice with optional manager notes |

## Security

The JangaRoo API sends an `x-webhook-secret` header with every request (if `N8N_WEBHOOK_SECRET` is set in your environment). You can add a **Header Auth** credential in n8n's webhook node to validate this secret and reject unauthorized calls.

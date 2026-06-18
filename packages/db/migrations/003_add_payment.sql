-- Migration 003: Payment link support
-- Add a payment_link_url to studios (e.g. a Stripe Payment Link URL)
-- and a payment_status column to bookings.

alter table studios
  add column if not exists payment_link_url text;

alter table bookings
  add column if not exists payment_status text
    check (payment_status in ('unpaid', 'paid', 'waived'))
    default 'unpaid';

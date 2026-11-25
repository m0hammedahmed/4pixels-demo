# 4Pixels - UX Redesign Demo

A front-end demo reimagining crm4pixels.app with the same brand identity and an improved user experience. English is the base language with a full Arabic (RTL) toggle.

## What this is

- A complete front-end: landing page, pricing, dashboard, orders, unified inbox, automations, WhatsApp templates, loyalty, SMS wallet, retention, delivery tracking, and settings.
- Realistic sample data throughout. No backend: buttons and flows run client-side for demonstration.
- Same brand colors as the current product (dark navy, orange/gold).

## What it fixes vs the current app

1. One-click Shopify connect instead of the manual custom-app flow.
2. Dismissable notifications with a clear close control.
3. Consistent bilingual support: full English base and full Arabic RTL, switchable everywhere.
4. A first-run onboarding checklist instead of dead-end empty states.
5. One unified EGP pricing list (InstaPay / Vodafone Cash) instead of mixed USD/EGP screens.
6. Honest automation and template states: running, paused, or waiting for Meta approval, with reasons.

## Stack

React + TypeScript, plain CSS. Source in `src/`:

- `src/App.tsx` - pages, shell, interactions
- `src/data.ts` - sample data (orders, chats, automations, templates, shipments)
- `src/i18n.ts` - English/Arabic strings
- `src/style.css` - design system

## Run locally

```
npm install
npm run dev
```

## Push to GitHub

```
git init
git add .
git commit -m "4Pixels UX redesign demo"
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A kid-friendly (grades 3-5) English dictionary web app hosted on Vercel. Uses the Merriam-Webster Elementary Dictionary API (sd2) via a serverless proxy, with a family password gate to control access.

## Running

Local development with Vercel CLI:

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Create .env with required vars
echo 'MW_API_KEY=your_key_here' >> .env
echo 'FAMILY_PASSWORD=your_password_here' >> .env

# Run locally
vercel dev
# then visit http://localhost:3000
```

No build step, no install step. The `.env` file is gitignored.

## Architecture

```
index.html        — Static frontend (CSS + HTML + vanilla JS in one file)
api/define.js     — Vercel serverless function (proxies MW API, checks password)
vercel.json       — (optional) Vercel routing config
.gitignore        — Ignores .env, node_modules, .vercel
```

### Data Flow

1. Kid types a word and taps search
2. Frontend sends `GET /api/define?word={word}` with `Authorization: Bearer {password}`
3. `api/define.js` validates password against `FAMILY_PASSWORD` env var (401 if invalid)
4. If valid, proxies to `https://dictionaryapi.com/api/v3/references/sd2/json/{word}?key={MW_API_KEY}`
5. Returns MW JSON to frontend
6. Frontend renders definition, pronunciation, part of speech, and example sentences

### Password Gate

- First visit: password input shown, search hidden
- Correct password stored in `localStorage`, main UI appears
- 401 from API: `localStorage` cleared, password prompt reappears
- No logout — clear browser data to reset

## Key Details

- MW Elementary Dictionary API requires a key (set as `MW_API_KEY` env var in Vercel)
- `FAMILY_PASSWORD` env var controls access — set in Vercel dashboard
- Audio pronunciation via MW media CDN (`media.merriam-webster.com`)
- Spelling suggestions rendered as tappable pill buttons when MW returns string array
- Definitions capped at 3 per part of speech
- MW markup (`{bc}`, `{it}`, `{sx|...|...}`, etc.) stripped before rendering
- All user input rendered via `textContent` (no XSS)
- Touch targets minimum 48px for tablet use

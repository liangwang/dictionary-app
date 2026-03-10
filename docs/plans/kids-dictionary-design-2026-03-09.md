# Kids Dictionary App — Design

## Goal

A kid-friendly (grades 3-5) dictionary web app. Minimalist, no distractions, visually warm, easy to tap on tablets.

## Architecture

```
index.html          — Static frontend served by Vercel
api/define.js       — Serverless proxy (holds API key, checks family password)
vercel.json         — Routing config (optional)
```

### Data Flow

1. Kid types a word, taps the search button
2. Frontend sends `GET /api/define?word=hello` with family password in `Authorization` header
3. `api/define.js` validates password against `FAMILY_PASSWORD` env var. Returns 401 if invalid.
4. If valid, proxies to `https://dictionaryapi.com/api/v3/references/sd2/json/{word}?key=MW_API_KEY`
5. Returns MW response to frontend
6. Frontend renders definition, pronunciation, and part of speech

### Vercel Environment Variables (set in dashboard, never in code)

- `MW_API_KEY` — Merriam-Webster Elementary Dictionary API key
- `FAMILY_PASSWORD` — Shared family password

## Password Gate

- First visit: search UI hidden, centered "Family Password" input + Submit button
- Correct password saved to `localStorage`, main UI appears
- Wrong password: gentle shake animation + "Try again" message
- Return visits: password auto-read from `localStorage`, sent with every request
- If API returns 401 (password changed): `localStorage` cleared, prompt reappears
- No logout button — clear browser data to reset

## Visual Design

### Colors

- Background: warm off-white (`#FFF8F0`)
- Card: white with warm shadow
- Primary accent: soft blue (`#5B9BD5`)
- Text: dark warm gray (`#2D2D2D`)
- Muted text: medium gray (`#7A7A7A`)

### Typography

- System font stack (clean, readable)
- Word title: `2.4rem`, bold
- Definitions: `1.15rem`, `line-height: 1.7`

### Layout

- `16px` rounded corners everywhere
- Magnifying glass icon button (no text) for search
- Max width `600px`, centered
- Generous padding and spacing
- All touch targets minimum `48px` tall

## Results Display

### Word Found

- Large word title (`2.4rem`)
- Phonetic spelling in accent color
- Speaker icon button for audio pronunciation
- Part of speech as section headers with subtle bottom border
- Up to 3 definitions per part of speech with soft blue bullets
- Example sentences in italics when available

### Word Not Found

- Friendly message: "Hmm, we couldn't find that word."
- "Did you mean..." with spelling suggestions as pill-shaped tappable buttons
- Tapping a suggestion searches that word immediately

### Loading

- "Looking it up..." text, no spinners

### Audio

- MW audio URL: `https://media.merriam-webster.com/audio/prons/en/us/mp3/{subdirectory}/{filename}.mp3`
- Tap speaker icon to play once. No autoplay.

## Out of Scope

- No user accounts or OAuth
- No search history or favorites
- No dark mode
- No animations beyond password shake
- No backend database

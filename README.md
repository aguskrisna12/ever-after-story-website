# Ever After Story

A responsive one-page landing site for Ever After Story, a wedding content creator based in Bali, Indonesia.

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/everafterstory.id/
NEXT_PUBLIC_SITE_URL=
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: digits only, including country code, without `+` or spaces.
- `NEXT_PUBLIC_INSTAGRAM_URL`: the public Instagram profile.
- `NEXT_PUBLIC_SITE_URL`: the final canonical website URL, without a trailing slash.

The inquiry form has no backend. It validates the required fields in the browser, formats the inquiry, and opens WhatsApp using the configured number.

## Content updates

- Portfolio items: `content/portfolio.ts`
- Packages: `content/services.ts`
- Placeholder testimonials: `content/testimonials.ts`
- Brand and links: `content/site-config.ts`
- Image replacement notes: `public/images/README.md`

The current wedding imagery is the AI-generated Bali reference set extracted from the company-profile PDF. Replace it and all placeholder testimonials with approved client material before presenting the portfolio as real client work.

## Quality checks

```bash
npx tsc --noEmit
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

# Hostingstrategi

Denne guiden beskriver realistiske deploy-alternativer for GameNight.

## Kort konklusjon

- **GitHub Pages beta**: Ja, realistisk nå.
- **Cloudflare langsiktig**: Ja, anbefalt (Cloudflare Pages static først).

## 1. GitHub Pages (statisk beta)

Prosjektet støtter statisk eksport via `output: 'export'` når `STATIC_EXPORT=true`.
Dette er pakket inn i scriptet:

```bash
npm run build:export
```

Output legges i `out/`.

## Automatisk deploy via GitHub Actions

Workflow:
- `.github/workflows/deploy-pages.yml`

Trigger:
- `push` til `main`
- `workflow_dispatch` (manuell kjøring)

Workflowen bruker moderne Pages-flyt:
- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

Build-env i workflow:
- `NEXT_PUBLIC_BASE_PATH=/GameNight`
- `NEXT_PUBLIC_SITE_URL=https://<github-bruker>.github.io`

Den publiserer `out/` og legger til `.nojekyll` for trygg håndtering av statiske `_next`-assets.

## Manuelt oppsett i GitHub (én gang)

1. Åpne repoet på GitHub.
2. Gå til **Settings → Pages**.
3. Sett **Source** til **GitHub Actions**.

Forventet URL:
- `https://<github-bruker>.github.io/GameNight/`

## Base path for repo-hosting

Hvis repoet publiseres under sti (typisk `https://<user>.github.io/<repo>`), sett:

```env
NEXT_PUBLIC_BASE_PATH=/GameNight
```

`next.config.ts` bruker da `basePath` og `assetPrefix` automatisk.

## Begrensninger i GitHub Pages-modus

- Ingen server-side API-ruter i samme app
- Donasjoner virker kun hvis `NEXT_PUBLIC_DONATION_API_URL` peker til ekstern backend
- All dynamikk må være klient-side eller pre-generert
- `robots.txt` peker fortsatt på produksjons-sitemap (`gamenight.no`), som er ok for prod men ikke perfekt for beta-domene

Dette er akseptabelt for dagens beta-scope.

## 2. Cloudflare (langsiktig)

## Anbefalt nå

Kjør fortsatt statisk eksport (`out/`) og host på Cloudflare Pages.
Fordeler:
- Lav kost
- Enkel drift
- Rask global edge-cache

## Senere ved behov

Hvis prosjektet trenger ekte backend-funksjoner (f.eks. Vipps-webhooks, admin, database),
kan man legge til:
- separat API-tjeneste (Cloudflare Workers / annen plattform), eller
- migrere til full Next-runtime på edge

Poenget er å holde frontend statisk så lenge som mulig.

## 3. Donasjonsintegrasjon (fremtid)

Donasjonsknappene forventer en endpoint som returnerer JSON med minst:

```json
{
  "status": "success",
  "checkoutFrontendUrl": "https://..."
}
```

Mulige statuser:
- `success`
- `not_configured`
- `error`

## 4. Verifisering før deploy

Kjør:

```bash
npm run typecheck
npm run build
npm run build:export
```

Hvis disse er grønne, er både vanlig Next-deploy og statisk beta-deploy teknisk mulig.

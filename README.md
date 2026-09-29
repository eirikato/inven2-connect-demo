# Inven2 Connect – guidet demo

Klikkbar, animert presentasjon av **Inven2 Connect**: én fiktiv DOFI («Nytt legemiddel mot
benskjørhet», team fra OUS og UiO) følges fra utkast til akseptert – sett fra forskeren i
portalen og (forenklet) fra Inven2 i Salesforce.

Alle personer, saker og tall er fiktive. Tekster, feltnavn, farger og e-postmaler er hentet
fra den ekte Inven2 Connect-løsningen (Inven2KI-sandkassen).

## Kjøre lokalt

Dobbeltklikk **`Start Demo.cmd`** – eller:

```sh
npm install
npm run dev        # http://localhost:5174/
```

## Styring under presentasjon

| Tast | Handling |
|---|---|
| Klikk / Mellomrom / → / Page Down | Neste steg |
| ← / Backspace / Page Up | Forrige steg |
| **A** | Auto-modus av/på |
| **C** | Undertekst av/på |
| **H** | Skjul/vis kontroller |
| **R** | Start på nytt |
| **?** | Snarveier |

Steg som venter på presentatøren (pekeren hviler over en knapp) utløses av neste trykk.

## Struktur

- `src/presentation/story.ts` – kapitler, steg, undertekster og klikkmål (manuset)
- `src/presentation/data.ts` – fiktive demodata (DOFI, oppfinnere, ansettelser)
- `src/presentation/Presentation.tsx` – motor: navigasjon, auto, kontroller
- `src/presentation/FakeCursor.tsx` – simulert musepeker med klikk-ring
- `src/presentation/scenes/` – sidene (forside, innlogging, DOFI, Mine DOFIer, Inven2 internt, avslutning)
- `src/styles.css` – Inven2 Connect-fargene som designtokens

## Publisering (GitHub Pages)

Push til `main` bygger og publiserer automatisk via
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).
Første gang: **Settings → Pages → Source: GitHub Actions** i repoet.

Bygge lokalt slik CI gjør det:

```powershell
$env:PAGES_BASE="/inven2-connect-demo/"; npm run build   # output i dist/
```

## Bygget med

Vite · React · TypeScript · Tailwind CSS v4 · Motion · lucide-react

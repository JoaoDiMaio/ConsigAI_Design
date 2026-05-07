# ConsigAI Webapp

ConsigAI is a React + Vite web app for loan simulation, proposal tracking, and onboarding flows. This repo currently uses local mock data and env toggles so the UI can be developed safely before the real API is connected.

## Requirements

- Node.js 20+
- npm 10+

## Quick Start

```bash
cd app
npm install
npm run dev
```

The app runs on the Vite local server. For the current workspace, the screenshot helper and smoke suite expect the app on `http://localhost:5175`.

## Scripts

- `npm run dev` - start the local app
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm test` - run Vitest unit tests
- `npm run test:smoke` - run Playwright smoke tests
- `npm run test:integrity` - lint + unit tests + build + smoke tests

## Mock Data Toggle

The offers flow can be switched between mock and API mode with:

```bash
VITE_USE_MOCK_OFFERS=true
```

Set it to `false` when the `/api/ofertas` endpoint is ready. The local example files are:

- [`.env.example`](./.env.example)
- [`.env.local`](./.env.local)

## Project Structure

- `src/pages/` - route screens
- `src/components/` - shared UI
- `src/hooks/` - reusable state hooks
- `src/lib/` - pure helpers and storage
- `src/data/` - mock data and static content
- `src/mocks/` - isolated mock payloads
- `src/api/` - endpoint constants
- `src/ui/` - theme and reusable style tokens
- `tests/` - Playwright smoke tests
- `src/__tests__/` - Vitest unit tests

## Testing Notes

- Unit tests currently cover formatters, hooks, and validators.
- Smoke tests cover the critical routes and the Entrada -> Cadastro CTA flow.
- `npm run build` should stay green before any merge.

## Screenshot Baseline

Screenshots are stored in `screenshots/`. The baseline is used to detect regressions across critical routes and should be refreshed only when the UI intentionally changes.

## Implementation Notes

- Mock profile data lives in `src/mocks/mockProfile.js`.
- Offer mock behavior is controlled by `VITE_USE_MOCK_OFFERS`.
- Proposal summary mock shape is documented in `src/mocks/mockProposalApi.js`.

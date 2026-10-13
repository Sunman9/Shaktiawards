# Shakti Awards website

This folder contains a responsive React/Vite landing page and a Supabase persistence starter. The supplied awards artwork is used as local background photography; no third-party partner, award winner, or impact figure is asserted as verified.

## Run locally

1. Install Node.js 20 or later.
2. Run `npm install` and `npm run dev`.
3. Until a submission endpoint is configured, forms clearly explain that submissions are not open and never display a fake receipt.

## Enable secure submissions

1. Create a Supabase project in the appropriate region and enable MFA for project administrators.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Deploy `supabase/functions/submit/index.ts` as an Edge Function with JWT gateway verification disabled. The function implements its own check of the `apikey` header against the project's publishable key and restricts browser origins. The platform provides `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions by default. Never place the service-role key in the Vite environment or client bundle.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting provider, then rebuild and deploy. The function URL is derived as `${VITE_SUPABASE_URL}/functions/v1/submit`.
5. Enable Supabase Auth for reviewers and use the Supabase dashboard with MFA and named staff accounts to review submissions and update status. Restrict staff access and periodically remove access that is no longer needed.
6. Before opening submissions, add request rate limiting/bot controls at the edge, define retention and deletion procedures, and publish a reviewed privacy notice with the data controller’s contact and applicable legal basis. The provided simple endpoint validates fields but does not yet provide rate limiting, data-retention automation, email receipts, duplicate-person detection, or a custom reviewer dashboard.

The submission API stores a random unique reference with each record and returns it only after database persistence succeeds. The client does not claim a successful submission if the backend is missing or errors. The Edge Function uses a server-side service key and the database has row-level security enabled without public read access. Add edge rate limiting/bot controls and a reviewed privacy notice before production launch.

## Build and host

Run `npm run build`; publish the generated `dist/` directory on a static host such as Vercel or Netlify. Configure `VITE_SUBMISSIONS_ENDPOINT` as a build-time environment variable, add the production domain to the Supabase allowed origin, and configure HTTPS and the host’s security headers. Point `https://shaktiawards.oohms.in` to the hosting project after verifying the domain’s DNS and existing production ownership.

## Content and launch checklist

- Confirm award categories, eligibility, dates, process, and Shakti contact details.
- Replace the generic privacy contact route with the approved privacy notice.
- Validate accessibility, mobile performance, analytics consent, and form abuse controls.
- Add approved names/logos only after partner and sponsor confirmation.

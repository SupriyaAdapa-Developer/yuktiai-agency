#!/usr/bin/env bash
# Deploy YuktiAI to Supabase + Netlify from a clean clone in under a minute.
# Live at: https://getyuktiai.netlify.app/
set -euo pipefail

: "${SUPABASE_PROJECT_REF:?required}"
: "${NETLIFY_AUTH_TOKEN:?required}"
: "${NETLIFY_SITE_ID:?required (e.g. getyuktiai)}"

echo "[1/5] applying database migrations..."
supabase db push --project-ref "$SUPABASE_PROJECT_REF"

echo "[2/5] applying RLS policies..."
supabase db query --project-ref "$SUPABASE_PROJECT_REF" -f supabase/policies.sql

echo "[3/5] seeding demo tenant + agents..."
supabase db query --project-ref "$SUPABASE_PROJECT_REF" -f supabase/seed.sql

echo "[4/5] deploying edge functions..."
for fn in api/*.ts; do
    name=$(basename "$fn" .ts)
    echo "  -> $name"
    supabase functions deploy "$name" --project-ref "$SUPABASE_PROJECT_REF"
done

echo "[5/5] deploying public/ to Netlify..."
npx --yes netlify-cli deploy \
    --dir=public \
    --site="$NETLIFY_SITE_ID" \
    --auth="$NETLIFY_AUTH_TOKEN" \
    --prod

echo "Done. Live at: https://getyuktiai.netlify.app/"

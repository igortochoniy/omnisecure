// Build wrapper: builds the TinaCMS admin only when TinaCloud keys are present
// (production / Cloudflare env). Without keys (fresh clone / local), it skips the
// admin build so the static site still builds — use `pnpm cms` for local editing.
import { execSync } from 'node:child_process';

const run = cmd => execSync(cmd, { stdio: 'inherit' });
const hasTina = process.env.TINA_PUBLIC_CLIENT_ID && process.env.TINA_TOKEN;

if (hasTina) {
  run('tinacms build --skip-cloud-checks');
} else {
  console.log(
    '[build] TINA_PUBLIC_CLIENT_ID/TINA_TOKEN not set — skipping CMS admin build (local/no-CMS mode).'
  );
}

run('astro check');
run('astro build');
run('node process-html.mjs');

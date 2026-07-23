// Runs SQL against the Supabase project via the Management API.
// Reads credentials from .env.local so no secret ever touches the shell.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function loadEnv() {
  const env = {};
  const text = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

export async function runSql(sql) {
  const env = loadEnv();
  const ref = env.SUPABASE_PROJECT_REF;
  const token = env.SUPABASE_ACCESS_TOKEN;
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: sql })
    }
  );
  const body = await res.text();
  if (!res.ok) throw new Error(`SQL failed (${res.status}): ${body}`);
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

// Allow `node mgmt.mjs "select now()"` for ad-hoc checks.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sql = process.argv[2] || "select now() as now;";
  runSql(sql).then(
    (r) => console.log(JSON.stringify(r, null, 2)),
    (e) => {
      console.error(String(e.message || e));
      process.exit(1);
    }
  );
}

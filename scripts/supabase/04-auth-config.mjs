// Configure auth: allowed redirect URLs for magic-link login.
import { loadEnv } from "./mgmt.mjs";

const env = loadEnv();
const ref = env.SUPABASE_PROJECT_REF;
const token = env.SUPABASE_ACCESS_TOKEN;

// Production site URL can be overridden by passing it as an argument.
const siteUrl = process.argv[2] || "http://localhost:4173";

const body = {
  site_url: siteUrl,
  uri_allow_list: [
    "http://localhost:4173/**",
    "http://localhost:5173/**",
    "http://localhost:3000/**",
    "https://*.vercel.app/**",
    "https://www.jsf2024.com/**",
    "https://jsf2024.com/**"
  ].join(","),
  mailer_otp_exp: 3600
};

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
const text = await res.text();
if (!res.ok) {
  console.error(`auth config failed (${res.status}): ${text}`);
  process.exit(1);
}
console.log("Auth config updated. site_url =", siteUrl);

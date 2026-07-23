import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// Dev-only plugin so POST /api/order works on localhost exactly like the Vercel
// serverless function does in production. Secrets are read server-side (Node)
// from .env via loadEnv — they never reach the client bundle.
function orderApiDev(env) {
  return {
    name: "order-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST" || !req.url.startsWith("/api/order")) return next();
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", async () => {
          try {
            const { sendOrderEmail } = await server.ssrLoadModule("/api/order.js");
            await sendOrderEmail(JSON.parse(raw || "{}"), {
              apiKey: env.RESEND_API_KEY,
              to: env.ORDER_EMAIL || "info@jsf2024.com",
              from: env.ORDER_FROM || "July Sunflowers <onboarding@resend.dev>"
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), orderApiDev(env)],
    server: { port: 5176, strictPort: true }
  };
});

import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

const ACTIVE = new Set(["paid", "approved", "active", "order_approved", "subscription_renewed"]);
const INACTIVE = new Set([
  "refunded", "chargedback", "canceled", "cancelled", "expired", "inactive",
  "subscription_canceled", "subscription_late", "order_refunded", "chargeback",
]);

export const Route = createFileRoute("/api/public/kiwify/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["KIWIFY_WEBHOOK_SECRET"];
        const baseId = process.env["KIWIFY_BASE_PRODUCT_ID"];
        const proId = process.env["KIWIFY_PRO_PRODUCT_ID"];
        if (!secret || !baseId || !proId) return new Response("Not configured", { status: 503 });

        const body = await request.text();
        const sig = new URL(request.url).searchParams.get("signature") ?? "";
        const expected = createHmac("sha1", secret).update(body).digest("hex");
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });

        let p: any;
        try { p = JSON.parse(body); } catch { return new Response("Bad JSON", { status: 400 }); }
        const order = p.order ?? p;
        const productId = String(order.Product?.product_id ?? order.product_id ?? "");
        const plan = productId === baseId ? "base" : productId === proId ? "pro" : null;
        const email = String(order.Customer?.email ?? order.customer?.email ?? "").trim();
        const event = String(order.webhook_event_type ?? "").toLowerCase();
        const status = String(order.Subscription?.status ?? order.order_status ?? "").toLowerCase();
        const subId = order.subscription_id ?? order.Subscription?.id ?? null;
        const nextRenewal = order.Subscription?.next_payment ?? null;
        const startedAt = order.Subscription?.start_date ?? order.approved_date ?? null;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: userId } = email
          ? await supabaseAdmin.rpc("user_id_by_email", { _email: email })
          : { data: null };

        await supabaseAdmin.from("subscription_events").insert({
          user_id: userId ?? null, email, plan, product_id: productId, subscription_id: subId,
          order_id: order.order_id ?? null, status, event_type: event,
          started_at: startedAt, next_renewal: nextRenewal, payload: p,
        });

        if (!plan || !userId) return new Response("ok (ignored)");

        let active: boolean | null = null;
        if (INACTIVE.has(event) || INACTIVE.has(status)) active = false;
        else if (ACTIVE.has(event) || ACTIVE.has(status)) active = true;
        if (active === null) return new Response("ok (no change)");

        const row = plan === "base"
          ? { base_active: active, base_status: status || event, base_subscription_id: subId, base_next_renewal: nextRenewal }
          : { pro_active: active, pro_status: status || event, pro_subscription_id: subId, pro_next_renewal: nextRenewal };
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert({ user_id: userId, ...row, updated_at: new Date().toISOString() });
        if (error) return new Response("DB error", { status: 500 });
        return new Response("ok");
      },
    },
  },
});

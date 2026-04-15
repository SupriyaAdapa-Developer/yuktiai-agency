#!/usr/bin/env node
// Seed a few demo messages on the inter-agent bus so the admin panel
// has something to render on first boot.
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const TENANT = "11111111-1111-1111-1111-111111111111";

const messages = [
    { from_agent: "vikram",  to_agent: "arya",    topic: "qualified_lead",
      payload_json: { company: "Acme Logistics", score: 87 } },
    { from_agent: "priya",   to_agent: "lakshmi", topic: "refund_request",
      payload_json: { ticket: "#482", amount_usd: 99 } },
    { from_agent: "lakshmi", to_agent: "priya",   topic: "refund_approved",
      payload_json: { stripe_id: "re_xyz", amount_usd: 99 } },
    { from_agent: "riya",    to_agent: "dev",     topic: "analytics_query",
      payload_json: { question: "pageviews per post, last 7d" } },
    { from_agent: "dev",     to_agent: "riya",    topic: "analytics_reply",
      payload_json: { top_post: "How we built YuktiAI", views: 1841 } },
];

const { error } = await sb.from("agent_messages").insert(
    messages.map((m) => ({ ...m, tenant_id: TENANT })),
);
if (error) {
    console.error(error);
    process.exit(1);
}
console.log("seeded", messages.length, "messages");

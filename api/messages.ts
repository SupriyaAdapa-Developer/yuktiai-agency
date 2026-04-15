// Supabase Edge Function: read recent messages on the inter-agent bus.
//   GET /functions/v1/messages?to=arya&limit=50
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const url  = Deno.env.get("SUPABASE_URL")!;
const anon = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  const auth = req.headers.get("authorization") ?? "";
  const sb = createClient(url, anon, { global: { headers: { Authorization: auth } } });

  const u = new URL(req.url);
  const to    = u.searchParams.get("to");
  const limit = Math.min(200, Number(u.searchParams.get("limit") ?? 50));

  let q = sb
    .from("agent_messages")
    .select("id, from_agent, to_agent, topic, payload_json, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (to) q = q.eq("to_agent", to);

  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ messages: data });
});

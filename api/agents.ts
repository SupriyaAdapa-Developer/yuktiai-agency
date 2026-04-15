// Supabase Edge Function: list agents for the current tenant.
//   GET  /functions/v1/agents
//   POST /functions/v1/agents       { id, display_name, role, config_json }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const url  = Deno.env.get("SUPABASE_URL")!;
const anon = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  const auth = req.headers.get("authorization") ?? "";
  const sb = createClient(url, anon, { global: { headers: { Authorization: auth } } });

  if (req.method === "GET") {
    const { data, error } = await sb
      .from("agents")
      .select("id, display_name, role, is_active, config_json")
      .order("display_name");
    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ agents: data });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { data, error } = await sb.from("agents").insert(body).select().single();
    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json(data, { status: 201 });
  }

  return new Response("Method Not Allowed", { status: 405 });
});

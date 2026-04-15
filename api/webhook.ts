// Supabase Edge Function: receive a webhook from n8n and queue a task.
//   POST /functions/v1/webhook   { agent_id, kind, payload_json }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const url  = Deno.env.get("SUPABASE_URL")!;
const svc  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const sig = req.headers.get("x-yukti-signature");
  if (sig !== Deno.env.get("YUKTI_WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  if (!body.agent_id || !body.kind) {
    return Response.json({ error: "agent_id + kind required" }, { status: 400 });
  }

  const sb = createClient(url, svc);
  const { data, error } = await sb.from("tasks").insert({
    tenant_id:    body.tenant_id,
    agent_id:     body.agent_id,
    kind:         body.kind,
    payload_json: body.payload_json ?? {},
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ task: data }, { status: 202 });
});

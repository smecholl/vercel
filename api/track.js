import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { event_type, page, popup_id, device_type, screen_width, ts } = req.body || {};

  if (!event_type || !page) {
    return res.status(400).json({ error: "missing_fields" });
  }

  const { error } = await supabase.from("events").insert([
    {
      event_type,
      page,
      popup_id: popup_id ?? null,
      device_type: device_type ?? null,
      screen_width: screen_width ?? null,
      ts: ts ?? new Date().toISOString()
    }
  ]);

  if (error) {
    return res.status(500).json({ error: "db_insert_failed" });
  }

  return res.status(200).json({ ok: true });
}

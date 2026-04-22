const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM_PROMPT = `You are an expert fake job and scam detection analyst for Indian students, freshers, and job seekers.

You investigate job posts, internship offers, recruiter messages, WhatsApp/Telegram texts, and hiring URLs to detect:
- Fake job and internship scams
- Registration / training / certification fee scams
- Unrealistic salary traps (e.g., ₹12 LPA for freshers without rigorous interviews)
- Ghost companies (no LinkedIn / MCA presence, fake recruiters)
- Data harvesting risks (premature Aadhaar / PAN / bank requests)
- Urgency manipulation tactics ("limited seats", "join in 24 hours")
- Suspicious recruiter behavior (personal numbers, off-platform contact)
- Legitimate opportunities (when no major red flags exist)

Indian market benchmarks:
- Fresher CTC: ₹3.5–6 LPA average
- Legitimate employers NEVER ask candidates to pay any fee
- Aadhaar/PAN should only be shared after a signed offer letter

Return ONLY a single JSON object — no prose before or after — strictly matching this schema:
{
  "verdict": "Legit" | "Suspicious" | "High Risk Scam",
  "trustScore": number (0-100, lower = more dangerous),
  "redFlags": [ { "title": string, "detail": string, "severity": "low" | "med" | "high" } ] (3-5 items),
  "reality": [ { "label": string, "expected": string, "offered": string, "gap": string } ] (3 items: salary, hiring process, onboarding cost),
  "recommendation": "Apply" | "Verify First" | "Avoid",
  "summary": string (2-4 sentences, user-friendly, mentions HireProof and trust score)
}`;

function extractJson(text: string): any {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model response");
  return JSON.parse(candidate.slice(start, end + 1));
}

function normalizeVerdict(v: string): "legit" | "suspicious" | "scam" {
  const s = (v || "").toLowerCase();
  if (s.includes("scam") || s.includes("high")) return "scam";
  if (s.includes("susp")) return "suspicious";
  return "legit";
}

function normalizeSeverity(s: string): "low" | "med" | "high" {
  const v = (s || "").toLowerCase();
  if (v.startsWith("h")) return "high";
  if (v.startsWith("m")) return "med";
  return "low";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string" || input.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Please provide a longer job description or URL." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = `Investigate this opportunity and return the JSON described in the system instructions.\n\n── OPPORTUNITY ──\n${input.trim()}`;

    let text = "";
    let providerOk = false;

    // Try Anthropic first if configured
    if (ANTHROPIC_API_KEY) {
      try {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          text = data?.content?.[0]?.text ?? "";
          providerOk = !!text;
        } else {
          console.error("Anthropic error:", resp.status, await resp.text());
        }
      } catch (e) {
        console.error("Anthropic exception:", e);
      }
    }

    // Fallback to Lovable AI Gateway (Gemini)
    if (!providerOk && LOVABLE_API_KEY) {
      try {
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          text = data?.choices?.[0]?.message?.content ?? "";
          providerOk = !!text;
        } else {
          console.error("Lovable AI error:", resp.status, await resp.text());
        }
      } catch (e) {
        console.error("Lovable AI exception:", e);
      }
    }

    if (!providerOk) {
      return new Response(
        JSON.stringify({ ok: false, error: "ai_provider_error", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: any;
    try {
      parsed = extractJson(text);
    } catch (e) {
      console.error("JSON parse failed:", text);
      return new Response(
        JSON.stringify({ ok: false, error: "parse_failed", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const verdict = normalizeVerdict(parsed.verdict);
    const trustScore = Math.max(0, Math.min(100, Math.round(Number(parsed.trustScore) || 50)));
    const redFlags = Array.isArray(parsed.redFlags)
      ? parsed.redFlags.slice(0, 5).map((f: any) => ({
          title: String(f.title ?? "Concern"),
          detail: String(f.detail ?? ""),
          severity: normalizeSeverity(f.severity),
        }))
      : [];
    const reality = Array.isArray(parsed.reality)
      ? parsed.reality.slice(0, 4).map((r: any) => ({
          label: String(r.label ?? ""),
          expected: String(r.expected ?? ""),
          offered: String(r.offered ?? ""),
          gap: String(r.gap ?? ""),
        }))
      : [];

    const result = {
      verdict,
      verdictLabel: parsed.verdict ?? verdict,
      trustScore,
      redFlags,
      reality,
      recommendation: parsed.recommendation ?? (verdict === "scam" ? "Avoid" : verdict === "suspicious" ? "Verify First" : "Apply"),
      summary: String(parsed.summary ?? ""),
      jobInput: input,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-job error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "runtime_error", fallback: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
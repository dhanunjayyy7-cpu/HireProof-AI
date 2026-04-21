export type Verdict = "legit" | "suspicious" | "scam";

export interface AnalysisResult {
  verdict: Verdict;
  trustScore: number;
  redFlags: { title: string; detail: string; severity: "low" | "med" | "high" }[];
  reality: { label: string; expected: string; offered: string; gap: string }[];
  summary: string;
  jobInput: string;
}

const SCAM_KEYWORDS = [
  "registration fee", "registration charge", "security deposit", "refundable fee",
  "aadhaar", "aadhar", "pan card", "send documents", "kyc fee",
  "training fee", "certification fee", "processing fee", "joining fee",
  "whatsapp", "telegram", "personal account", "gpay", "phonepe",
  "12 lpa fresher", "20 lpa fresher", "no interview", "guaranteed selection",
  "work from home easy", "earn 50000", "earn 1 lakh", "daily payout",
];

const SUSPICIOUS_KEYWORDS = [
  "urgent hiring", "limited seats", "immediate joining", "no experience required",
  "100% placement", "free laptop", "stipend after training", "unpaid internship",
  "remote", "internship offer", "package", "ctc",
];

const SAFE_SIGNALS = [
  "linkedin", "official email", "structured interview", "hr round",
  "technical interview", "offer letter on letterhead", "verified company",
];

export function analyzeJob(input: string): AnalysisResult {
  const text = input.toLowerCase();
  let scamHits = SCAM_KEYWORDS.filter((k) => text.includes(k));
  let suspiciousHits = SUSPICIOUS_KEYWORDS.filter((k) => text.includes(k));
  let safeHits = SAFE_SIGNALS.filter((k) => text.includes(k));

  // Salary detection (e.g., 12 LPA, ₹15 LPA, 20 lpa)
  const lpaMatch = text.match(/(\d{1,3})\s*(lpa|lakhs?\s*per\s*annum|l\s*p\s*a)/i);
  const offeredLpa = lpaMatch ? parseInt(lpaMatch[1], 10) : null;
  if (offeredLpa && offeredLpa >= 10) {
    scamHits.push(`unrealistic ${offeredLpa} lpa fresher`);
  }

  let score = 78;
  score -= scamHits.length * 18;
  score -= suspiciousHits.length * 6;
  score += safeHits.length * 8;
  score = Math.max(4, Math.min(98, score));

  let verdict: Verdict = "legit";
  if (score < 35) verdict = "scam";
  else if (score < 65) verdict = "suspicious";

  const redFlags: AnalysisResult["redFlags"] = [];
  if (text.match(/registration|joining|training|certification|processing/) && text.includes("fee")) {
    redFlags.push({
      title: "Upfront fee requested",
      detail: "Legitimate employers never ask candidates to pay any fee — registration, training, or certification.",
      severity: "high",
    });
  }
  if (text.includes("aadhaar") || text.includes("aadhar") || text.includes("pan card")) {
    redFlags.push({
      title: "Sensitive ID requested early",
      detail: "Aadhaar / PAN should only be shared after a verified offer letter is signed.",
      severity: "high",
    });
  }
  if (offeredLpa && offeredLpa >= 10) {
    redFlags.push({
      title: `Unrealistic ₹${offeredLpa} LPA fresher offer`,
      detail: `Average fresher CTC in India is ₹3.5–6 LPA. ₹${offeredLpa} LPA without rigorous interviews is a classic bait.`,
      severity: "high",
    });
  }
  if (text.includes("whatsapp") || text.includes("telegram")) {
    redFlags.push({
      title: "Communication on personal channels",
      detail: "Recruitment over WhatsApp/Telegram from personal numbers indicates an unverifiable hiring pipeline.",
      severity: "med",
    });
  }
  if (text.includes("urgent") || text.includes("immediate joining") || text.includes("limited seats")) {
    redFlags.push({
      title: "Manufactured urgency",
      detail: "Pressure tactics like 'limited seats' or 'join in 24 hours' are designed to stop you from verifying.",
      severity: "med",
    });
  }
  if (text.includes("no interview") || text.includes("guaranteed selection")) {
    redFlags.push({
      title: "No real evaluation",
      detail: "Skipping interviews entirely is the strongest indicator of a fake placement scheme.",
      severity: "high",
    });
  }
  if (redFlags.length === 0 && verdict !== "legit") {
    redFlags.push({
      title: "Insufficient verifiable details",
      detail: "Company website, recruiter LinkedIn, and structured interview process could not be confirmed.",
      severity: "med",
    });
  }
  if (verdict === "legit" && redFlags.length === 0) {
    redFlags.push({
      title: "No major red flags detected",
      detail: "Still verify on LinkedIn, MCA portal, and ask for an official offer on company letterhead.",
      severity: "low",
    });
  }

  const reality: AnalysisResult["reality"] = [];
  reality.push({
    label: "Annual Salary",
    expected: offeredLpa ? "₹3.5 – 6 LPA (fresher avg.)" : "₹3.5 – 6 LPA (fresher avg.)",
    offered: offeredLpa ? `₹${offeredLpa} LPA` : "Not disclosed clearly",
    gap: offeredLpa && offeredLpa >= 10 ? `${Math.round((offeredLpa / 5) * 100 - 100)}% above market` : "Within range",
  });
  reality.push({
    label: "Hiring Process",
    expected: "Resume → HR → Technical → Offer letter",
    offered: text.includes("no interview") || text.includes("immediate") ? "Direct selection, no rounds" : "Standard rounds claimed",
    gap: text.includes("no interview") ? "Skips evaluation entirely" : "Acceptable",
  });
  reality.push({
    label: "Onboarding Cost",
    expected: "₹0 — employer pays you",
    offered: text.includes("fee") ? "Fee requested from candidate" : "No fee mentioned",
    gap: text.includes("fee") ? "Reverse cash-flow scam pattern" : "Safe",
  });

  let summary = "";
  if (verdict === "scam") {
    summary = `🚨 HIGH RISK SCAM detected. HireProof flagged ${redFlags.length} critical red flag(s) including upfront fee patterns, unrealistic compensation, or premature ID requests. Trust score ${score}/100. Do NOT pay any money or share Aadhaar/PAN. Block the recruiter, report on cybercrime.gov.in, and alert your peers.`;
  } else if (verdict === "suspicious") {
    summary = `⚠️ SUSPICIOUS opportunity. HireProof found ${redFlags.length} concern(s) — mostly around vague hiring process, unverifiable company, or pressure tactics. Trust score ${score}/100. Before proceeding: verify recruiter on LinkedIn, search company on MCA portal, and refuse any payment requests.`;
  } else {
    summary = `✅ Looks LEGIT. HireProof found no major scam patterns. Trust score ${score}/100. Still recommended: confirm offer on company letterhead, verify HR email domain matches the company website, and never share Aadhaar/PAN until after signing.`;
  }

  return { verdict, trustScore: score, redFlags, reality, summary, jobInput: input };
}

export function improvePrompt(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  return `Please investigate the following job/internship opportunity for scam patterns common in India:

── OPPORTUNITY DETAILS ──
${trimmed}

── INVESTIGATION CHECKLIST ──
1. Does the offer ask for any upfront fee (registration / training / certification)?
2. Is the salary realistic for a fresher in India (benchmark ₹3.5–6 LPA)?
3. Are Aadhaar / PAN / bank details requested before a signed offer?
4. Is communication on official email or personal WhatsApp / Telegram?
5. Is there a structured interview process or instant selection?
6. Can the company be verified on LinkedIn, MCA, or Glassdoor?

Return a clear verdict (Legit / Suspicious / High Risk Scam), a trust score, key red flags, and what I should do next.`;
}
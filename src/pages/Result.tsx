import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, ShieldAlert, ShieldX, Copy, Check, ArrowLeft,
  AlertTriangle, TrendingUp, Sparkles, ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/jobguard/Navbar";
import { Footer } from "@/components/jobguard/Footer";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/jobguard";
import { toast } from "sonner";

const verdictMap = {
  legit: {
    icon: ShieldCheck,
    label: "Likely Legit",
    sub: "No major scam patterns detected.",
    bg: "bg-success-soft",
    text: "text-success",
    ring: "ring-success/20",
    bar: "bg-success",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "Suspicious",
    sub: "Proceed with extreme caution.",
    bg: "bg-warning-soft",
    text: "text-warning",
    ring: "ring-warning/20",
    bar: "bg-warning",
  },
  scam: {
    icon: ShieldX,
    label: "High Risk Scam",
    sub: "Do not engage. Report and block.",
    bg: "bg-danger-soft",
    text: "text-danger",
    ring: "ring-danger/20",
    bar: "bg-danger",
  },
} as const;

const sevMap = {
  high: "bg-danger-soft text-danger border-danger/20",
  med: "bg-warning-soft text-warning border-warning/20",
  low: "bg-success-soft text-success border-success/20",
};

const Result = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("jobguard:result");
    if (!raw) {
      navigate("/analyze");
      return;
    }
    setResult(JSON.parse(raw));
  }, [navigate]);

  const shareText = useMemo(() => {
    if (!result) return "";
    return `${result.summary}

──────────────
Analyzed using HireProof — free AI platform helping users avoid scams, save time, and make smarter career decisions.`;
  }, [result]);

  const copy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const v = verdictMap[result.verdict];
  const Icon = v.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-36 pb-16">
        <div className="container">
          <Link to="/analyze" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Investigate another
          </Link>

          {/* SECTION 1 — VERDICT */}
          <div className={`relative max-w-5xl mx-auto rounded-3xl ${v.bg} border border-border/60 p-7 md:p-10 overflow-hidden animate-scale-in`}>
            <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
              <div className="relative">
                <div className={`absolute inset-0 rounded-2xl ${v.bar} opacity-20 animate-pulse-ring`} />
                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background flex items-center justify-center shadow-soft ${v.text}`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.2} />
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${v.text} mb-1`}>Verdict</p>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{v.label}</h1>
                <p className="mt-2 text-muted-foreground md:text-lg">{v.sub}</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust Score</p>
                <p className={`text-5xl md:text-6xl font-bold ${v.text} tabular-nums`}>{result.trustScore}<span className="text-2xl text-muted-foreground">/100</span></p>
              </div>
            </div>
          </div>

          {/* SECTION 2+3 — Trust Score & Red Flags */}
          <div className="max-w-5xl mx-auto mt-6 grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 p-6 md:p-7 rounded-3xl bg-card border border-border/70 shadow-soft animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-semibold text-foreground">Trust Score</h2>
              </div>
              <p className={`text-5xl font-bold ${v.text} tabular-nums mb-3`}>{result.trustScore}</p>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${v.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${result.trustScore}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0 Scam</span><span>50</span><span>100 Safe</span>
              </div>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                Calculated from 40+ scam signals: fee patterns, salary realism, ID requests, recruiter footprint, and urgency tactics.
              </p>
            </div>

            <div className="md:col-span-3 p-6 md:p-7 rounded-3xl bg-card border border-border/70 shadow-soft animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-danger-soft text-danger flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-semibold text-foreground">Key Red Flags</h2>
              </div>
              <ul className="space-y-3">
                {result.redFlags.map((f, i) => (
                  <li key={i} className={`p-4 rounded-2xl border ${sevMap[f.severity]}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/60">
                        {f.severity === "high" ? "High" : f.severity === "med" ? "Medium" : "Info"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{f.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 4 — Reality vs Scam */}
          <div className="max-w-5xl mx-auto mt-6 p-6 md:p-8 rounded-3xl bg-card border border-border/70 shadow-soft animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Reality vs Offer</h2>
                <p className="text-sm text-muted-foreground">Side-by-side comparison with Indian market benchmarks.</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="text-left py-3 px-4 w-1/4">Signal</th>
                    <th className="text-left py-3 px-4">Reality (market)</th>
                    <th className="text-left py-3 px-4">What was offered</th>
                    <th className="text-left py-3 px-4">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.reality.map((r, i) => (
                    <tr key={i} className="text-sm">
                      <td className="py-4 px-4 font-semibold text-foreground">{r.label}</td>
                      <td className="py-4 px-4 text-muted-foreground">{r.expected}</td>
                      <td className="py-4 px-4 text-foreground">{r.offered}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          r.gap.toLowerCase().includes("safe") || r.gap.toLowerCase().includes("acceptable") || r.gap.toLowerCase().includes("within")
                            ? "bg-success-soft text-success"
                            : "bg-danger-soft text-danger"
                        }`}>
                          {r.gap}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 5 — Shareable Result */}
          <div className="max-w-5xl mx-auto mt-6 rounded-3xl bg-foreground text-background p-7 md:p-8 shadow-card animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-background/60 mb-1">Shareable Result</p>
                <h2 className="text-xl md:text-2xl font-semibold">Send this to a friend before they apply.</h2>
              </div>
              <Button
                onClick={copy}
                className="rounded-full h-11 bg-background text-foreground hover:bg-background/90 font-medium shrink-0"
              >
                {copied ? <><Check className="w-4 h-4 mr-1.5" /> Copied</> : <><Copy className="w-4 h-4 mr-1.5" /> Copy</>}
              </Button>
            </div>

            <div className="rounded-2xl bg-background/5 border border-background/10 p-5 md:p-6 backdrop-blur">
              <p className="text-background/95 leading-relaxed whitespace-pre-line">{result.summary}</p>
              <div className="mt-5 pt-5 border-t border-background/15">
                <p className="text-sm text-background/70 leading-relaxed">
                  Analyzed using <span className="font-semibold text-background">HireProof</span> — free AI platform helping users avoid scams, save time, and make smarter career decisions.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="rounded-full h-11 bg-transparent border-background/20 text-background hover:bg-background/10 hover:text-background">
                <Link to="/analyze">
                  Investigate another <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Result;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Link2, FileText, ArrowRight, Loader2, GraduationCap, Briefcase, Globe2 } from "lucide-react";
import { Logo } from "@/components/jobguard/Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { improvePrompt, analyzeJob } from "@/lib/jobguard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const presets = [
  {
    icon: GraduationCap,
    audience: "For Students",
    text: "I received an internship offer asking ₹2,500 registration fee before joining. Check if this is genuine or a scam.",
    tone: "brand",
  },
  {
    icon: Briefcase,
    audience: "For Job Seekers",
    text: "This company is offering ₹12 LPA for a fresher role with quick joining. Analyze whether this looks trustworthy.",
    tone: "warning",
  },
  {
    icon: Globe2,
    audience: "For Internship Seekers",
    text: "Remote internship asks for Aadhaar, PAN card, and urgent confirmation before interview. Check all risks.",
    tone: "danger",
  },
] as const;

const toneMap = {
  brand: "bg-brand-soft text-brand",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

const Analyze = () => {
  const [tab, setTab] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const navigate = useNavigate();

  const loadingMessages = [
    "Scanning signals…",
    "Checking recruiter patterns…",
    "Verifying claims…",
    "Cross-checking Indian market data…",
  ];

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const id = setInterval(() => {
      setLoadingStep((s) => (s + 1) % loadingMessages.length);
    }, 1400);
    return () => clearInterval(id);
  }, [loading]);

  const handleImprove = () => {
    const raw = tab === "text" ? text : url;
    if (!raw.trim()) {
      toast.error("Add some details first.");
      return;
    }
    setImproving(true);
    setTimeout(() => {
      setText(improvePrompt(raw));
      setTab("text");
      setImproving(false);
      toast.success("Prompt enhanced 10x ✨");
    }, 600);
  };

  const handleInvestigate = async () => {
    const raw = tab === "text" ? text : url;
    if (!raw.trim()) {
      toast.error("Paste a job description or URL to analyze.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-job", {
        body: { input: raw },
      });
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error ?? "Analysis failed");
      sessionStorage.setItem("jobguard:result", JSON.stringify(data));
      navigate("/result");
    } catch (e) {
      console.error(e);
      // Graceful fallback: never crash the demo — use local heuristic analyzer
      try {
        const fallback = analyzeJob(raw);
        sessionStorage.setItem("jobguard:result", JSON.stringify(fallback));
        toast.message("Showing offline analysis", {
          description: "Live AI is unavailable — results based on local scam heuristics.",
        });
        navigate("/result");
      } catch {
        toast.error("Unable to analyze right now. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar (no global navbar on this page) */}
      <div className="absolute top-5 left-5 md:left-8 z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>
      </div>

      <main className="flex-1 pt-20 md:pt-28 pb-16 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Investigate any job offer in <span className="text-gradient">10 seconds.</span>
            </h1>
            <p className="mt-4 md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste a job description, WhatsApp message, or recruiter link. We'll flag every scam pattern instantly.
            </p>
          </div>

          {/* SECTION 1 — INPUT */}
          <div className="max-w-3xl mx-auto bg-card border border-border/70 rounded-3xl shadow-card p-5 md:p-7 animate-scale-in">
            <div className="flex items-center gap-2 p-1 rounded-full bg-muted w-fit mb-5">
              <button
                onClick={() => setTab("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === "text" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4" /> Paste Text
              </button>
              <button
                onClick={() => setTab("url")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === "url" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link2 className="w-4 h-4" /> Paste URL
              </button>
            </div>

            {tab === "text" ? (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the WhatsApp message, email, or job description here…&#10;&#10;e.g., 'Congratulations! You've been selected for ₹15 LPA software role. Pay ₹3,500 registration fee to reserve your seat. Send Aadhaar to confirm.'"
                className="min-h-[200px] md:min-h-[240px] text-base resize-none rounded-2xl border-border focus-visible:ring-foreground/20 bg-background"
              />
            ) : (
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/job-listing"
                className="h-14 text-base rounded-2xl border-border focus-visible:ring-foreground/20 bg-background px-5"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <Button
                onClick={handleImprove}
                disabled={improving}
                variant="outline"
                className="rounded-full h-12 px-5 border-brand/30 bg-brand-soft hover:bg-brand-soft/70 text-brand hover:text-brand font-medium group"
              >
                {improving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                Make Your Prompt 10x Effective
              </Button>
              <Button
                onClick={handleInvestigate}
                disabled={loading}
                className="flex-1 rounded-full h-12 bg-foreground hover:bg-foreground/90 text-background shadow-glow font-medium text-base group"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingMessages[loadingStep]}</>
                ) : (
                  <>Investigate Now <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </Button>
            </div>
          </div>

          {/* SECTION 2 — PRESETS */}
          <div className="max-w-5xl mx-auto mt-16 md:mt-20">
            <div className="text-center mb-8">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-brand mb-3">Ready-Made Prompts</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Not sure what to ask? Try one of these.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {presets.map((p, i) => (
                <button
                  key={p.audience}
                  onClick={() => {
                    setText(p.text);
                    setTab("text");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    toast.success("Prompt loaded");
                  }}
                  className="text-left p-6 rounded-3xl bg-card border border-border/70 shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-foreground/30 transition-all duration-300 animate-fade-in-up group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${toneMap[p.tone]}`}>
                    <p.icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">{p.audience.replace("For ", "FOR ")}</p>
                  <p className="text-foreground font-medium leading-relaxed">"{p.text}"</p>
                  <p className="mt-4 text-sm text-brand font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Use this prompt <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;
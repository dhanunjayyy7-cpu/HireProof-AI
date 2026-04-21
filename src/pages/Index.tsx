import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, ShieldAlert, Database, TrendingUp, Building2,
  Clipboard, Brain, BadgeCheck, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/jobguard/Navbar";
import { Footer } from "@/components/jobguard/Footer";
import { Button } from "@/components/ui/button";

const scams = [
  {
    icon: BadgeCheck,
    title: "Fake Certification Scams",
    desc: "₹2,500 'mandatory training' for an internship that never starts. The certificate is worthless and the company vanishes.",
    tone: "danger",
  },
  {
    icon: Database,
    title: "Data Harvesting Scams",
    desc: "Aadhaar, PAN, and bank details collected before any interview — sold on Telegram or used for loan fraud in your name.",
    tone: "warning",
  },
  {
    icon: TrendingUp,
    title: "Unrealistic Salary Traps",
    desc: "₹12 LPA fresher offers with no interview. The bait that funnels students into MLM, crypto laundering, or upfront 'kits'.",
    tone: "danger",
  },
  {
    icon: Building2,
    title: "Ghost Companies",
    desc: "Shiny website, fake LinkedIn page, no MCA registration. By the time you realize it, your money and time are gone.",
    tone: "warning",
  },
];

const steps = [
  {
    icon: Clipboard,
    title: "Paste job text or URL",
    desc: "Drop the WhatsApp message, email, or job listing link. No signup. No friction.",
  },
  {
    icon: Brain,
    title: "AI investigates 40+ signals",
    desc: "Salary realism, fee patterns, recruiter footprint, urgency tactics, ID requests — all analyzed in seconds.",
  },
  {
    icon: ShieldAlert,
    title: "Get a clear verdict instantly",
    desc: "Trust score, red flags, and a shareable report. Forward it to your friends before they click.",
  },
];

const toneMap = {
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
} as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border shadow-soft mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span className="text-xs font-semibold text-foreground">AI-powered scam investigation · Free for students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-[1.05]">
              Don't let a fake job <span className="text-gradient">steal your future.</span>
            </h1>

            <p className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Every month thousands of Indian students lose money, time, and trust to fake internships and ghost recruiters. JobGuard checks any opportunity in 10 seconds — before you click apply.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full h-12 px-7 bg-foreground hover:bg-foreground/90 text-background shadow-glow text-base font-medium group">
                <Link to="/analyze">
                  Try It For Free
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full h-12 px-7 text-base font-medium">
                <a href="#why">Learn More</a>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No signup</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Built for India</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 100% free</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section id="why" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Why this exists</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              The 4 scams quietly draining India's job seekers
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              We built JobGuard after seeing too many students lose ₹5,000–₹50,000 to opportunities that never existed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
            {scams.map((s, i) => (
              <div
                key={s.title}
                className="group relative p-7 md:p-8 rounded-3xl bg-card border border-border/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${toneMap[s.tone as keyof typeof toneMap]}`}>
                  <s.icon className="w-6 h-6" strokeWidth={2.2} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 md:py-28 bg-muted/40 border-y border-border/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              Three steps. Ten seconds. Total clarity.
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative p-7 md:p-8 rounded-3xl bg-card border border-border/70 shadow-soft animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute -top-4 left-7 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold shadow-soft">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-5 mt-3">
                  <s.icon className="w-6 h-6" strokeWidth={2.2} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-bold text-foreground text-balance">
              Every minute you wait, another student pays a fake registration fee.
            </h3>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Check the next opportunity before you reply. It takes ten seconds and costs nothing.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full h-12 px-7 bg-foreground hover:bg-foreground/90 text-background shadow-glow text-base font-medium group">
              <Link to="/analyze">
                Try It For Free
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

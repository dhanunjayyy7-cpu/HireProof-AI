import { Link } from "react-router-dom";
import logo from "@/assets/hireproof-logo.png";
import {
  ArrowRight, ShieldAlert, Database, TrendingUp, Building2,
  Clipboard, Brain, BadgeCheck, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/jobguard/Navbar";
import { Footer } from "@/components/jobguard/Footer";
import { Button } from "@/components/ui/button";

const scams = [
  {
    icon: BadgeCheck,
    title: "Fake Certification Scams",
    desc: "Pay ₹2,500 today, receive a useless certificate tomorrow, and never hear from them again.",
    tone: "danger",
  },
  {
    icon: Database,
    title: "Data Harvesting Scams",
    desc: "They ask for Aadhaar, PAN, and bank details before interviews, then misuse or sell your data.",
    tone: "warning",
  },
  {
    icon: TrendingUp,
    title: "Unrealistic Salary Traps",
    desc: "₹12 LPA for freshers with no interview. The offer sounds exciting because the trap is designed that way.",
    tone: "danger",
  },
  {
    icon: Building2,
    title: "Ghost Companies",
    desc: "Fake websites, fake LinkedIn pages, fake recruiters. By the time you realize it, your chance is gone.",
    tone: "warning",
  },
];

const steps = [
  {
    icon: Clipboard,
    title: "Paste Job Text or URL",
    desc: "Drop any job post, recruiter message, WhatsApp text, or hiring link. No signup. No confusion.",
  },
  {
    icon: Brain,
    title: "AI Investigates 40+ Signals",
    desc: "We scan salary claims, urgency tactics, recruiter behavior, fee demands, trust signals, and hidden risks.",
  },
  {
    icon: ShieldAlert,
    title: "Get a Clear Verdict Instantly",
    desc: "Receive trust score, red flags, and next-step guidance you can share before anyone gets trapped.",
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-[1.05]">
              Don't let a fake job <span className="text-gradient">steal your future.</span>
            </h1>

            <p className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Every month thousands of Indian students lose money, time, and trust to fake internships and ghost recruiters. HireProof checks any opportunity in 10 seconds — before you click apply.
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

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs md:text-sm text-muted-foreground uppercase tracking-[0.18em] font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No Signup</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Built For India</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 100% Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section id="why" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.42em] text-brand mb-4">— Why This Exists —</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              The 4 scams quietly draining India's job seekers
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              We built HireProof after seeing too many students lose ₹5,000–₹50,000 to opportunities that never existed.
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
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.42em] text-brand mb-4">— How It Works —</p>
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
                <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-5">
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

      {/* Bottom-left brand mark */}
      <section className="border-t border-border/60 bg-gradient-hero">
        <div className="container py-14 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 blur-2xl rounded-full opacity-60 group-hover:opacity-90 transition-opacity" />
              <span className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white ring-1 ring-border shadow-soft">
                <img src={logo} alt="HireProof" className="w-full h-full object-cover" />
              </span>
            </div>
            <div>
              <p className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-none">
                Hire<span className="text-brand">Proof</span>
              </p>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-md">
                Built in India · Trusted by students, freshers, and job seekers.
              </p>
            </div>
          </div>
          <p className="text-xs md:text-sm uppercase tracking-[0.22em] font-semibold text-muted-foreground">
            © {new Date().getFullYear()} HireProof
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

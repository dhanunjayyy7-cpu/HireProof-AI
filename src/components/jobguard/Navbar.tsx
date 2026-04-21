import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/hireproof-logo.png";

const links = [
  { label: "Why This Exists", href: "#why" },
  { label: "How It Works", href: "#how" },
  { label: "Try Free", href: "/analyze", primary: true },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-3 md:top-5 left-0 right-0 z-50 px-3 md:px-6 pointer-events-none flex justify-center">
      <div
        className={`pointer-events-auto inline-flex rounded-full transition-all duration-500 ease-out ${
          scrolled
            ? "bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.18)] h-13"
            : "bg-[#F2F2F2] h-14 md:h-15"
        }`}
      >
        <div className="h-full flex items-center gap-6 md:gap-10 pl-4 pr-2 md:pl-5 md:pr-2 py-2">
          {/* Brand — circular logo only */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center group"
            aria-label="HireProof home"
          >
            <span
              className={`rounded-full overflow-hidden bg-white ring-1 ring-black/5 shadow-soft flex items-center justify-center transition-all duration-500 ${
                scrolled ? "w-8 h-8" : "w-9 h-9 md:w-10 md:h-10"
              }`}
            >
              <img src={logo} alt="HireProof" className="w-full h-full object-cover" />
            </span>
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((l) => {
              const isCTA = scrolled && l.primary;
              return (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className={`text-sm transition-all duration-500 rounded-full ${
                    isCTA
                      ? "bg-white text-[#111111] font-bold px-5 py-2 hover:bg-white/90 shadow-soft"
                      : scrolled
                      ? "text-white font-semibold px-4 py-2 hover:text-white/80"
                      : "text-[#111111] font-semibold px-4 py-2 hover:text-[#111111]/70"
                  }`}
                  style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
                >
                  {l.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${
              scrolled ? "text-white" : "text-[#111111]"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="pointer-events-auto md:hidden mx-auto max-w-5xl mt-2 rounded-3xl bg-background/95 backdrop-blur-xl border border-border shadow-card animate-fade-in">
          <div className="p-3 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className={`text-left px-4 py-3 rounded-2xl font-semibold transition-colors ${
                  l.primary
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

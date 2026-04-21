import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) =>
            l.primary ? (
              <Button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="ml-2 rounded-full bg-foreground hover:bg-foreground/90 text-background px-5 h-10 font-medium shadow-soft"
              >
                {l.label}
              </Button>
            ) : (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full transition-colors"
              >
                {l.label}
              </button>
            )
          )}
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                  l.primary
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
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
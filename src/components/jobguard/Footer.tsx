import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border/60 bg-muted/30">
    <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <Logo />
      <p className="text-sm text-muted-foreground text-center md:text-right">
        © {new Date().getFullYear()} HireProof · Helping India's job seekers stay safe from scams.
      </p>
    </div>
  </footer>
);
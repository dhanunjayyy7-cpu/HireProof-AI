import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-brand rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
      <div className="relative w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-soft">
        <ShieldCheck className="w-5 h-5 text-brand-foreground" strokeWidth={2.5} />
      </div>
    </div>
    <span className="text-xl font-bold tracking-tight text-foreground">
      Job<span className="text-gradient">Guard</span>
    </span>
  </Link>
);
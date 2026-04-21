import { Link } from "react-router-dom";
import logo from "@/assets/hireproof-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "lg";
  textClassName?: string;
  accentClassName?: string;
}

export const Logo = ({
  className = "",
  size = "sm",
  textClassName,
  accentClassName,
}: LogoProps) => {
  const dims = size === "lg" ? "w-12 h-12 md:w-14 md:h-14" : "w-9 h-9";
  const text = size === "lg" ? "text-3xl md:text-4xl" : "text-xl";
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <span
        className={`${dims} rounded-full overflow-hidden bg-white ring-1 ring-border shadow-soft flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        <img src={logo} alt="HireProof logo" className="w-full h-full object-cover" />
      </span>
      <span className={`${text} font-bold tracking-tight ${textClassName ?? "text-foreground"}`}>
        Hire<span className={accentClassName ?? "text-brand"}>Proof</span>
      </span>
    </Link>
  );
};

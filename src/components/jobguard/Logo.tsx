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
      <img
        src={logo}
        alt="HireProof logo"
        className={`${dims} object-contain transition-transform group-hover:scale-105`}
      />
      <span className={`${text} font-bold tracking-tight ${textClassName ?? "text-foreground"}`}>
        Hire<span className={accentClassName ?? "text-brand"}>Proof</span>
      </span>
    </Link>
  );
};

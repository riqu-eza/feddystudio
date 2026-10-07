import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  target?: string;
};

export default function Button({
  href,
  children,
  variant = "outline",
  type = "button",
  onClick,
  className = "",
  target,
}: Props) {
  const base =
    "inline-block px-6 py-3 rounded border font-bold transition-transform hover:-translate-y-0.5";
  const styles =
    variant === "primary"
      ? "bg-gold text-[#111] border-gold"
      : "border-gold text-light";

  const cls = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
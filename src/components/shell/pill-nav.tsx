"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PillNavItem {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PillNavProps {
  items: PillNavItem[];
  activeKey?: string;
  className?: string;
}

export function PillNav({ items, activeKey, className }: PillNavProps) {
  return (
    <nav className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Navigation">
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const cls = cn(isActive ? "pill-nav-active" : "pill-nav focus-ring");

        if (item.href) {
          return (
            <Link key={item.key} href={item.href} className={cls}>
              {item.label}
            </Link>
          );
        }

        return (
          <button key={item.key} type="button" onClick={item.onClick} className={cls}>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

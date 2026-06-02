"use client";

import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface BloomLayerProps {
  open: boolean;
  layoutId?: string;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BloomLayer({
  open,
  layoutId,
  title,
  onClose,
  children,
  className,
}: BloomLayerProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus trap: keep keyboard focus within the open dialog, support Escape to close,
  // and restore focus to the trigger on close. Backdrop-click-to-close is preserved below.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;

    const focusFirst = () => {
      if (!node) return;
      if (node.contains(document.activeElement)) return; // respect existing autoFocus
      const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE);
      (focusables[0] ?? node).focus();
    };
    const timer = window.setTimeout(focusFirst, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusables.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKey, true);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <AnimatePresence>
          {open ? (
            <motion.div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.12 : 0.18 }}
              onClick={onClose}
              role="presentation"
            >
              <motion.div
                ref={dialogRef}
                layoutId={layoutId}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className={cn("bloom-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto focus:outline-none", className)}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.992 }}
                transition={{
                  duration: reduce ? 0.12 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {title ? (
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary px-3 py-1.5 text-xs"
                      aria-label="Close panel"
                    >
                      Close
                    </button>
                  </div>
                ) : null}
                {children}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}

"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils/cn";

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
                layoutId={layoutId}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn("bloom-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto", className)}
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

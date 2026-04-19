import { motion } from "motion/react";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className,
  amplitude = 8,
  duration = 3,
}: FloatingElementProps) {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <motion.div
      className={className}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [-amplitude / 2, amplitude / 2, -amplitude / 2],
            }
      }
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

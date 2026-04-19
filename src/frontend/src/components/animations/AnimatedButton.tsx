import { motion } from "motion/react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ children, className }: AnimatedButtonProps) {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <motion.div
      className={className}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.03,
              filter:
                "brightness(1.08) drop-shadow(0 0 8px rgba(22,163,74,0.35))",
            }
      }
      whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

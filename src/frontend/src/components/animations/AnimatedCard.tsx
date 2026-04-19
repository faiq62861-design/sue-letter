import { motion } from "motion/react";
import { useCallback, useState } from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enableTilt?: boolean;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  enableTilt = false,
}: AnimatedCardProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTilt || prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rotateX: -y * 8,
        rotateY: x * 8,
      });
    },
    [enableTilt, prefersReducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <motion.div
      className={className}
      style={
        enableTilt
          ? {
              perspective: "1000px",
              transformStyle: "preserve-3d",
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
            }
          : {}
      }
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.02,
              y: -4,
              boxShadow:
                "0 12px 40px rgba(22, 163, 74, 0.12), 0 4px 16px rgba(0,0,0,0.08)",
              borderColor: "rgba(22, 163, 74, 0.35)",
            }
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

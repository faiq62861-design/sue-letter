import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function useParallax(speed = 0.3) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [
      prefersReducedMotion ? "0%" : `${-speed * 100}%`,
      prefersReducedMotion ? "0%" : `${speed * 100}%`,
    ],
  );

  return { ref: containerRef, y };
}

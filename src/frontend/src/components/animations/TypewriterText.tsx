import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 50,
  className,
  cursor = true,
}: TypewriterTextProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!isVisible) return;

    if (prefersReducedMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let index = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isVisible, text, speed, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {cursor && (
        <span
          className={`inline-block w-0.5 h-[1em] bg-current align-text-bottom ml-0.5 ${done ? "animate-pulse" : "opacity-100"}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

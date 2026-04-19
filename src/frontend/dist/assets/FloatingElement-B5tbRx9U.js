import { j as jsxRuntimeExports, _ as motion } from "./index-DkssxSHZ.js";
function FloatingElement({
  children,
  className,
  amplitude = 8,
  duration = 3
}) {
  const prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className,
      animate: prefersReducedMotion ? {} : {
        y: [-amplitude / 2, amplitude / 2, -amplitude / 2]
      },
      transition: {
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      },
      children
    }
  );
}
export {
  FloatingElement as F
};

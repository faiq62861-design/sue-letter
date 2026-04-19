import { c as createLucideIcon, ae as useScrollAnimation, r as reactExports, j as jsxRuntimeExports } from "./index-DkssxSHZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode);
function CountUp({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
  className
}) {
  const { ref, isVisible } = useScrollAnimation();
  const [count, setCount] = reactExports.useState(0);
  const animationRef = reactExports.useRef(null);
  const startTimeRef = reactExports.useRef(null);
  const prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  reactExports.useEffect(() => {
    if (!isVisible) return;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1e3), 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * end));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [isVisible, end, duration, prefersReducedMotion]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { ref, className, children: [
    prefix,
    count.toLocaleString(),
    suffix
  ] });
}
export {
  CountUp as C,
  Download as D
};

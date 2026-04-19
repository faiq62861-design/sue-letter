import { motion } from "motion/react";
import { Children } from "react";

interface StaggeredListProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  initialDelay?: number;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const itemVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function StaggeredList({
  children,
  staggerDelay = 0.1,
  className,
  initialDelay = 0,
}: StaggeredListProps) {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const containerVars = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        ...containerVariants,
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      };

  const itemVars = prefersReducedMotion ? itemVariantsReduced : itemVariants;

  return (
    <motion.div
      className={className}
      variants={containerVars}
      initial="hidden"
      animate="visible"
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVars}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

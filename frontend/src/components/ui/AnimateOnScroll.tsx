import React, { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** delay in milliseconds */
  delay?: number;
  /** distance in pixels to translate from the start */
  offset?: number;
  /** animation direction */
  direction?: "up" | "down" | "left" | "right";
  /** additional className to merge */
  className?: string;
}

/**
 * AnimateOnScroll
 * Simple, dependency-free intersection observer based reveal animation.
 * Usage:
 *  <AnimateOnScroll delay={100} direction="up"> ... </AnimateOnScroll>
 */
const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  delay = 0,
  offset = 16,
  direction = "up",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If element is already in view on mount (common on mobile), reveal it immediately
    const rect = el.getBoundingClientRect();
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportH * 0.9 && rect.bottom > 0) {
      requestAnimationFrame(() => setVisible(true));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);

    // Safety fallback: in case IntersectionObserver misses
    const fallback = setTimeout(() => setVisible(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "up" || direction === "left" ? 1 : -1;
  const initialTransform = `translate${axis}(${sign * offset}px)`;

  const style: React.CSSProperties = {
    transition: `opacity 600ms ease, transform 600ms ease`,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : initialTransform,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

export default AnimateOnScroll;

import { useEffect } from "react";

export function useParallax(containerRef) {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;

      el.querySelectorAll(".parallax, .card").forEach((child, i) => {
        const depth = 6 + i * 2;
        child.style.transform = `translate3d(${(-nx * depth).toFixed(1)}px, ${(-ny * depth).toFixed(1)}px, 0)`;
      });
    };

    const onLeave = () => {
      el.querySelectorAll(".parallax, .card").forEach((child) => {
        child.style.transform = "translate3d(0,0,0)";
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);
}

    import { useEffect } from "react";

    export function useReveals() {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll(".reveal"));
        if (!els.length) return;

        const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("in");
            });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
    }

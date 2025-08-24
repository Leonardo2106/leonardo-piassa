import { useEffect, useRef, useState, useCallback } from "react";

export default function Starfield({
  defaultSpeed = 0,
  defaultDensity = 2.2,
}) {
  const canvasRef = useRef(null);
  const reqRef = useRef(0);

  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [density, setDensity] = useState(defaultDensity);

  const isMobile = window.matchMedia('(max-width: 480px)').matches;
  const MAX_STARS = isMobile ? 900 : 1600;

  const DPR_LIMIT = 2;
  const BASE_DENSITY = 1.0;
  const DEPTH = 1000;
  const FOV = 350;
  const BASE_SPEED = 1;
  const SPEED_MULT = 26;
  const MIN_STARS = 250;

  const stateRef = useRef({
    DPR: 1, W: 0, H: 0, CX: 0, CY: 0,
    stars: [],
    last: 0,
  });
  
  const cssPx = useCallback((v) => Math.round(v * stateRef.current.DPR), []);

  const targetStarCount = useCallback(() => {
    const { W, H } = stateRef.current;
    const area = W * H;
    const count = Math.round(area * BASE_DENSITY * density);
    return Math.max(MIN_STARS, Math.min(MAX_STARS, count));
  }, [density]);

  const newStar = useCallback(() => {
    const { W, H } = stateRef.current;
    const spawnRadiusX = W * 0.7, spawnRadiusY = H * 0.7;
    return {
      x: (Math.random() * 2 - 1) * spawnRadiusX,
      y: (Math.random() * 2 - 1) * spawnRadiusY,
      z: Math.random() * (DEPTH - 1) + 1,
      px: null, py: null,
    };
  }, []);

  const rebuildStars = useCallback(() => {
    const need = targetStarCount();
    const arr = new Array(need);
    for (let i = 0; i < need; i++) arr[i] = newStar();
    stateRef.current.stars = arr;
  }, [newStar, targetStarCount]);

  const project = useCallback((s) => {
    const { CX, CY } = stateRef.current;
    const scale = FOV / s.z;
    return [CX + s.x * scale, CY + s.y * scale];
  }, []);

  const recycle = useCallback((s) => {
    const { W, H } = stateRef.current;
    s.x = (Math.random() * 2 - 1) * W * 0.7;
    s.y = (Math.random() * 2 - 1) * H * 0.7;
    s.z = DEPTH;
    s.px = null; s.py = null;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const DPR = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
    const w = window.innerWidth, h = window.innerHeight;

    stateRef.current.DPR = DPR;
    stateRef.current.W = w;
    stateRef.current.H = h;
    stateRef.current.CX = w / 2;
    stateRef.current.CY = h / 2;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = cssPx(w);
    canvas.height = cssPx(h);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    rebuildStars();
  }, [cssPx, rebuildStars]);

  const step = useCallback((ts) => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const sref = stateRef.current;
    if (!sref.last) sref.last = ts;
    const frames = (ts - sref.last) / 16.6667;
    sref.last = ts;

    const dt = Math.min(frames, 180);
    const bigJump = frames > 5;

    const curSpeed = BASE_SPEED + SPEED_MULT * speed;

    ctx.clearRect(0, 0, sref.W, sref.H);

    for (let i = 0; i < sref.stars.length; i++) {
      const s = sref.stars[i];
      s.z -= curSpeed * dt;
      if (s.z <= 1) recycle(s);

      const [x, y] = project(s);
      if (
        x < -sref.W * 0.5 || x > sref.W * 1.5 ||
        y < -sref.H * 0.5 || y > sref.H * 1.5
      ) { recycle(s); continue; }

      const t = 1 - s.z / DEPTH;
      const alpha = Math.min(1, 0.35 + t * 0.9);
      const w = 0.2 + t * 3;

      if (bigJump) { s.px = s.py = null; }

      ctx.beginPath();
      if (s.px !== null && s.py !== null) {
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.1, y + 0.1);
      }
      ctx.lineWidth = w;
      ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.stroke();

      s.px = x; s.py = y;
    }

    reqRef.current = requestAnimationFrame(step);
  }, [isRunning, project, recycle, speed]);

  useEffect(() => {
    resize();
    if (isRunning) {
      reqRef.current = requestAnimationFrame(step);
    }

    const onResize = () => resize();
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning(prev => !prev);
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(reqRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [resize, step, isRunning]);

  useEffect(() => {
    rebuildStars();
  }, [density, rebuildStars]);

  const toggle = () => {
    setIsRunning(prev => !prev);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        id="starfield"
        aria-label="Campo de estrelas animado"
        role="img"
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", display: "block", zIndex: 0 }}
      />
      {/* <div className="hud" aria-label="Controles do efeito de estrelas">
        <div className="group">
          <label htmlFor="speed">Speed</label>
          <input
            id="speed"
            type="range"
            min="0" max="4" step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>
        <div className="group">
          <label htmlFor="density">Density</label>
          <input
            id="density"
            type="range"
            min="0.6" max="2.2" step="0.1"
            value={density}
            onChange={(e) => setDensity(parseFloat(e.target.value))}
          />
        </div>
        <div className="sep" aria-hidden="true"></div>
        <button onClick={toggle}>{isRunning ? "Pause" : "Resume"}</button>
      </div>
      <div className="brand">Press <b>Space</b> to pause/resume the space theme</div> */}
    </>
  );
}
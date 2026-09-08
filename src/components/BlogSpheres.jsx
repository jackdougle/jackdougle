import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../content/blog/index.js";

/* Blog listing: each post is a sphere drifting inside an arena.
   Spheres bounce off the arena walls and each other (elastic collisions, mass
   proportional to area) and can be grabbed and thrown with the pointer.
   Positions live in refs and are written straight to the DOM from a rAF loop
   so the simulation never re-renders React. */

const CRUISE_SPEED = 22; // px/s the spheres relax back to when left alone
const MAX_FLING_SPEED = 1400; // px/s cap on a thrown sphere
const RESTITUTION = 0.92; // energy kept on wall / sphere impacts
const WANDER = 0.9; // rad/s max random heading drift, so paths curve
const MAX_DT = 1 / 30; // clamp after tab switches so nothing tunnels
const CLICK_SLOP = 6; // px of drag before a release stops counting as a click
const DRAG_STALL_MS = 80; // pointer idle this long -> held sphere has no velocity

function radiusFor(arenaWidth) {
  return Math.round(Math.min(132, Math.max(84, arenaWidth * 0.2)));
}

/* Scatter bodies without overlap; falls back to overlapping placement (the
   collision solver separates them on the first frames). */
function scatter(bodies, w, h) {
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      b.x = b.r + Math.random() * Math.max(0, w - 2 * b.r);
      b.y = b.r + Math.random() * Math.max(0, h - 2 * b.r);
      placed = bodies
        .slice(0, i)
        .every((o) => Math.hypot(o.x - b.x, o.y - b.y) > o.r + b.r + 12);
    }
    const angle = Math.random() * Math.PI * 2;
    b.vx = Math.cos(angle) * CRUISE_SPEED;
    b.vy = Math.sin(angle) * CRUISE_SPEED;
  }
}

/* Static layout for reduced-motion users: a centered row that wraps. */
function gridPlace(bodies, w, h) {
  const d = bodies[0]?.r * 2 || 0;
  const gap = 24;
  const perRow = Math.max(1, Math.floor((w + gap) / (d + gap)));
  const rows = Math.ceil(bodies.length / perRow);
  const totalH = rows * d + (rows - 1) * gap;
  bodies.forEach((b, i) => {
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, bodies.length - row * perRow);
    const rowW = inRow * d + (inRow - 1) * gap;
    const col = i - row * perRow;
    b.x = (w - rowW) / 2 + col * (d + gap) + b.r;
    b.y = (h - totalH) / 2 + row * (d + gap) + b.r;
    b.vx = 0;
    b.vy = 0;
  });
}

function step(bodies, w, h, dt, now) {
  for (const b of bodies) {
    if (b.drag) {
      // A held sphere sits where the pointer put it; if the pointer has gone
      // still, it stops carrying momentum into whatever it touches.
      if (now - b.drag.lastT > DRAG_STALL_MS) {
        b.vx = 0;
        b.vy = 0;
      }
      continue;
    }

    let speed = Math.hypot(b.vx, b.vy);
    if (speed < 0.5) {
      const angle = Math.random() * Math.PI * 2;
      b.vx = Math.cos(angle) * CRUISE_SPEED * 0.5;
      b.vy = Math.sin(angle) * CRUISE_SPEED * 0.5;
      speed = CRUISE_SPEED * 0.5;
    }

    // Relax toward cruise speed: thrown spheres bleed off energy fairly
    // quickly, slow ones pick up gently, so everything keeps ambling.
    const k = speed > CRUISE_SPEED ? 1.4 : 0.6;
    const next = CRUISE_SPEED + (speed - CRUISE_SPEED) * Math.exp(-k * dt);
    const scale = next / speed;
    b.vx *= scale;
    b.vy *= scale;

    const turn = (Math.random() - 0.5) * 2 * WANDER * dt;
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);
    const vx = b.vx * cos - b.vy * sin;
    const vy = b.vx * sin + b.vy * cos;
    b.vx = vx;
    b.vy = vy;

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    if (b.x - b.r < 0) {
      b.x = b.r;
      b.vx = Math.abs(b.vx) * RESTITUTION;
    } else if (b.x + b.r > w) {
      b.x = w - b.r;
      b.vx = -Math.abs(b.vx) * RESTITUTION;
    }
    if (b.y - b.r < 0) {
      b.y = b.r;
      b.vy = Math.abs(b.vy) * RESTITUTION;
    } else if (b.y + b.r > h) {
      b.y = h - b.r;
      b.vy = -Math.abs(b.vy) * RESTITUTION;
    }
  }

  // Pairwise impulse collisions. A held sphere has infinite mass so it shoves
  // the others around without being displaced itself.
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.hypot(dx, dy);
      const minDist = a.r + b.r;
      if (dist >= minDist) continue;
      if (dist === 0) {
        dx = 1;
        dy = 0;
        dist = 1;
      }
      const nx = dx / dist;
      const ny = dy / dist;
      const invA = a.drag ? 0 : 1 / a.m;
      const invB = b.drag ? 0 : 1 / b.m;
      const invSum = invA + invB;
      if (invSum === 0) continue;

      const overlap = minDist - dist;
      a.x -= nx * overlap * (invA / invSum);
      a.y -= ny * overlap * (invA / invSum);
      b.x += nx * overlap * (invB / invSum);
      b.y += ny * overlap * (invB / invSum);

      const relN = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (relN >= 0) continue; // already separating
      const impulse = (-(1 + RESTITUTION) * relN) / invSum;
      a.vx -= impulse * invA * nx;
      a.vy -= impulse * invA * ny;
      b.vx += impulse * invB * nx;
      b.vy += impulse * invB * ny;
    }
  }
}

function BlogSpheres({ posts }) {
  const arenaRef = useRef(null);
  const nodeRefs = useRef([]);
  const bodiesRef = useRef(
    posts.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, r: 100, m: 1, drag: null })),
  );
  const sizeRef = useRef({ w: 0, h: 0 });
  const suppressClick = useRef(new Set());
  const reduceMotion = useRef(false);
  const [ready, setReady] = useState(false);

  const paint = () => {
    bodiesRef.current.forEach((b, i) => {
      const el = nodeRefs.current[i];
      if (el) el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
    });
  };

  // Arena-local, un-zoomed pointer coordinates. `.desktop-scale` applies a CSS
  // zoom, so client px and layout px differ by rect.width / offsetWidth.
  const localPoint = (e) => {
    const arena = arenaRef.current;
    const rect = arena.getBoundingClientRect();
    const k = rect.width / (arena.offsetWidth || rect.width);
    return { x: (e.clientX - rect.left) / k, y: (e.clientY - rect.top) / k };
  };

  useLayoutEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let initialized = false;
    const measure = () => {
      const w = arena.clientWidth;
      const h = arena.clientHeight;
      if (!w || !h) return;
      sizeRef.current = { w, h };
      const r = radiusFor(w);
      const bodies = bodiesRef.current;
      bodies.forEach((b, i) => {
        b.r = r;
        b.m = r * r;
        const el = nodeRefs.current[i];
        if (el) el.style.setProperty("--r", String(r));
      });
      if (!initialized) {
        initialized = true;
        if (reduceMotion.current) gridPlace(bodies, w, h);
        else scatter(bodies, w, h);
        setReady(true);
      } else if (reduceMotion.current) {
        gridPlace(bodies, w, h);
      } else {
        for (const b of bodies) {
          b.x = Math.min(Math.max(b.x, b.r), w - b.r);
          b.y = Math.min(Math.max(b.y, b.r), h - b.r);
        }
      }
      paint();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(arena);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion.current) return;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      const { w, h } = sizeRef.current;
      if (w && h) {
        step(bodiesRef.current, w, h, dt, now);
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  const onPointerDown = (i) => (e) => {
    if (reduceMotion.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const b = bodiesRef.current[i];
    const p = localPoint(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    suppressClick.current.delete(i);
    b.drag = {
      id: e.pointerId,
      offX: b.x - p.x,
      offY: b.y - p.y,
      lastX: p.x,
      lastY: p.y,
      lastT: performance.now(),
      moved: 0,
    };
    b.vx = 0;
    b.vy = 0;
    e.currentTarget.classList.add("sphere-held");
  };

  const onPointerMove = (i) => (e) => {
    const b = bodiesRef.current[i];
    if (!b.drag || b.drag.id !== e.pointerId) return;
    const p = localPoint(e);
    const now = performance.now();
    const dt = Math.max(1, now - b.drag.lastT) / 1000;
    const { w, h } = sizeRef.current;
    const nx = Math.min(Math.max(p.x + b.drag.offX, b.r), w - b.r);
    const ny = Math.min(Math.max(p.y + b.drag.offY, b.r), h - b.r);
    // Blend so a jittery pointer produces a steady throw velocity.
    b.vx = b.vx * 0.5 + ((nx - b.x) / dt) * 0.5;
    b.vy = b.vy * 0.5 + ((ny - b.y) / dt) * 0.5;
    b.drag.moved += Math.hypot(p.x - b.drag.lastX, p.y - b.drag.lastY);
    b.drag.lastX = p.x;
    b.drag.lastY = p.y;
    b.drag.lastT = now;
    b.x = nx;
    b.y = ny;
  };

  const onPointerEnd = (i) => (e) => {
    const b = bodiesRef.current[i];
    if (!b.drag || b.drag.id !== e.pointerId) return;
    if (b.drag.moved > CLICK_SLOP) suppressClick.current.add(i);
    if (performance.now() - b.drag.lastT > DRAG_STALL_MS) {
      b.vx = 0;
      b.vy = 0;
    }
    const speed = Math.hypot(b.vx, b.vy);
    if (speed > MAX_FLING_SPEED) {
      b.vx *= MAX_FLING_SPEED / speed;
      b.vy *= MAX_FLING_SPEED / speed;
    }
    b.drag = null;
    e.currentTarget.classList.remove("sphere-held");
  };

  const onClick = (i) => (e) => {
    if (suppressClick.current.has(i)) {
      e.preventDefault();
      suppressClick.current.delete(i);
    }
  };

  return (
    <div
      ref={arenaRef}
      className="sphere-arena relative h-[min(72dvh,720px)] min-h-[480px] w-full"
    >
      {posts.map(({ slug, title, subtitle, date, cover }, i) => (
        <Link
          key={slug}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          to={`/blog/${slug}`}
          className={`sphere${ready ? " sphere-ready" : ""}`}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={onPointerDown(i)}
          onPointerMove={onPointerMove(i)}
          onPointerUp={onPointerEnd(i)}
          onPointerCancel={onPointerEnd(i)}
          onClick={onClick(i)}
        >
          <img
            src={cover}
            alt=""
            draggable={false}
            className="sphere-texture"
          />
          <span aria-hidden="true" className="sphere-shade" />
          <span className="sphere-plate">
            <span className="font-heading block font-medium leading-snug">
              {title}
            </span>
            <span className="mt-[0.35em] block text-[0.8em] font-light text-gray-500 dark:text-gray-400">
              {formatDate(date)}
            </span>
            {subtitle ? (
              <span className="mt-[0.15em] hidden text-[0.8em] font-light leading-snug text-black sm:block dark:text-white">
                {subtitle}
              </span>
            ) : null}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default BlogSpheres;

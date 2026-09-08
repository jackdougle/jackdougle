import { useCallback, useEffect, useRef, useState } from "react";

const DURATION_IN_MS = 2400;
const DURATION_OUT_MS = 1800;

function coverBottomSrc(img, destW, destH) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(destW / iw, destH / ih);
  const sw = destW / scale;
  const sh = destH / scale;
  return { sx: (iw - sw) / 2, sy: ih - sh, sw, sh };
}

function blockThreshold(col, row) {
  const n = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function coarseNoise(cx, cy) {
  return blockThreshold(cx * 7 + 13, cy * 11 + 17);
}

function sampleClumpedThreshold(col, row, clumpScale) {
  const fx = col / clumpScale;
  const fy = row / clumpScale;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = smoothstep(fx - x0);
  const ty = smoothstep(fy - y0);

  const v00 = coarseNoise(x0, y0);
  const v10 = coarseNoise(x0 + 1, y0);
  const v01 = coarseNoise(x0, y0 + 1);
  const v11 = coarseNoise(x0 + 1, y0 + 1);

  const a = v00 + (v10 - v00) * tx;
  const b = v01 + (v11 - v01) * tx;
  const coarse = a + (b - a) * ty;
  const fine = blockThreshold(col, row);

  // Mostly clumped, with enough fine noise to keep edges irregular.
  return coarse * 0.72 + fine * 0.28;
}

const thresholdCache = { key: "", data: null };

function getClumpedThresholdField(cols, rows, clumpScale) {
  const key = `${cols}x${rows}@${clumpScale}`;
  if (thresholdCache.key === key) return thresholdCache.data;

  const field = new Float32Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      field[row * cols + col] = sampleClumpedThreshold(col, row, clumpScale);
    }
  }

  thresholdCache.key = key;
  thresholdCache.data = field;
  return field;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function isCellActive(col, row, eased, cols, rows, thresholds) {
  if (col < 0 || row < 0 || col >= cols || row >= rows) return false;
  return eased >= thresholds[row * cols + col];
}

const GLASS_RIM = 0.14;

function drawExternalGlassRim(ctx, x, y, w, h, edges) {
  if (edges.top) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.26)";
    ctx.fillRect(x, y, w, GLASS_RIM);
  }
  if (edges.left) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.26)";
    ctx.fillRect(x, y, GLASS_RIM, h);
  }
  if (edges.bottom) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(x, y + h - GLASS_RIM, w, GLASS_RIM);
  }
  if (edges.right) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(x + w - GLASS_RIM, y, GLASS_RIM, h);
  }
}

/*
  Only draw cells that have turned pixelated onto a transparent canvas.
  The sharp photo stays visible underneath — no full-grid overlay, no cell seams.
*/
function paintProgressivePixelation(canvas, img, cssW, cssH, pixelSize, progress, clumpScale) {
  if (!cssW || !cssH || !img.naturalWidth) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const eased = easeOutCubic(Math.max(0, Math.min(1, progress)));
  if (eased <= 0) return;

  const cols = Math.max(1, Math.ceil(cssW / pixelSize));
  const rows = Math.max(1, Math.ceil(cssH / pixelSize));
  const thresholds = getClumpedThresholdField(cols, rows, clumpScale);
  const lowW = cols;
  const lowH = rows;
  const low = document.createElement("canvas");
  low.width = lowW;
  low.height = lowH;
  const lctx = low.getContext("2d");
  const crop = coverBottomSrc(img, lowW, lowH);
  lctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, lowW, lowH);
  const lowData = lctx.getImageData(0, 0, lowW, lowH).data;

  const cellW = cssW / cols;
  const cellH = cssH / rows;
  const cells = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isCellActive(col, row, eased, cols, rows, thresholds)) continue;

      const x = col * cellW;
      const y = row * cellH;
      const w = col === cols - 1 ? cssW - x : cellW;
      const h = row === rows - 1 ? cssH - y : cellH;
      const i = (row * lowW + col) * 4;

      ctx.fillStyle = `rgb(${lowData[i]},${lowData[i + 1]},${lowData[i + 2]})`;
      ctx.fillRect(x, y, w, h);
      cells.push({ x, y, w, h, col, row });
    }
  }

  for (const { x, y, w, h, col, row } of cells) {
    drawExternalGlassRim(ctx, x, y, w, h, {
      top: !isCellActive(col, row - 1, eased, cols, rows, thresholds),
      right: !isCellActive(col + 1, row, eased, cols, rows, thresholds),
      bottom: !isCellActive(col, row + 1, eased, cols, rows, thresholds),
      left: !isCellActive(col - 1, row, eased, cols, rows, thresholds),
    });
  }
}

function PixelateHoverImage({ src, alt, frameClass, imgClass, pixelSize = 5, clumpScale = 5 }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [ready, setReady] = useState(false);

  const paintFrame = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.complete || !img.naturalWidth) return;

    const cssW = img.clientWidth;
    const cssH = img.clientHeight;
    canvas.style.left = `${img.offsetLeft}px`;
    canvas.style.top = `${img.offsetTop}px`;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    paintProgressivePixelation(canvas, img, cssW, cssH, pixelSize, progressRef.current, clumpScale);
  }, [pixelSize, clumpScale]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = (time) => {
      const last = lastTimeRef.current || time;
      const delta = time - last;
      lastTimeRef.current = time;

      const duration = targetRef.current > progressRef.current ? DURATION_IN_MS : DURATION_OUT_MS;
      const step = delta / duration;
      const target = targetRef.current;

      if (progressRef.current < target) {
        progressRef.current = Math.min(target, progressRef.current + step);
      } else if (progressRef.current > target) {
        progressRef.current = Math.max(target, progressRef.current - step);
      }

      paintFrame();

      if (progressRef.current !== target || target > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stopLoop();
        paintFrame();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [paintFrame, stopLoop]);

  const setActive = useCallback(
    (active) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      targetRef.current = active ? 1 : 0;
      if (reduced) {
        progressRef.current = active ? 1 : 0;
        paintFrame();
        return;
      }
      startLoop();
    },
    [paintFrame, startLoop],
  );

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;

    let cancelled = false;

    const sync = () => {
      if (cancelled || !img.complete || !img.naturalWidth) return;
      paintFrame();
      if (!cancelled) setReady(true);
    };

    const onLoad = () => sync();
    img.addEventListener("load", onLoad);
    if (img.complete) sync();

    const ro = new ResizeObserver(() => {
      progressRef.current = targetRef.current;
      sync();
    });
    ro.observe(frame);
    ro.observe(img);

    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);
    frame.addEventListener("mouseenter", onEnter);
    frame.addEventListener("mouseleave", onLeave);
    frame.addEventListener("focus", onEnter);
    frame.addEventListener("blur", onLeave);

    return () => {
      cancelled = true;
      img.removeEventListener("load", onLoad);
      ro.disconnect();
      frame.removeEventListener("mouseenter", onEnter);
      frame.removeEventListener("mouseleave", onLeave);
      frame.removeEventListener("focus", onEnter);
      frame.removeEventListener("blur", onLeave);
      stopLoop();
    };
  }, [src, pixelSize, clumpScale, paintFrame, setActive, stopLoop]);

  return (
    <div
      ref={frameRef}
      className={`pixelate-hover ${frameClass}`}
      tabIndex={0}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt ?? ""}
        className={`pixelate-hover-photo ${imgClass}`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pixelate-hover-canvas${ready ? " pixelate-hover-canvas-ready" : ""}`}
      />
    </div>
  );
}

export default PixelateHoverImage;

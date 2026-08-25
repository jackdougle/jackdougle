import { useState, useEffect } from "react";

/** Matches `.desktop-scale` in index.css — shrink applied on large screens. */
export const DESKTOP_SCALE = 0.81;

const ZOOM_STEPS = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4,
  5,
];

/** Screen/window width — stable under Cmd +/- browser zoom (unlike innerWidth). */
function getLayoutWidth() {
  return window.outerWidth;
}

function snapZoom(raw) {
  return ZOOM_STEPS.reduce((best, step) =>
    Math.abs(step - raw) < Math.abs(best - raw) ? step : best,
  );
}

function getBrowserZoom() {
  const clientWidth = document.documentElement.clientWidth;
  if (!clientWidth) return 1;
  const raw = window.outerWidth / clientWidth;
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  return snapZoom(raw);
}

export function useLayoutViewport() {
  const [layoutWidth, setLayoutWidth] = useState(getLayoutWidth);
  const [browserZoom, setBrowserZoom] = useState(getBrowserZoom);

  useEffect(() => {
    function onResize() {
      setLayoutWidth(getLayoutWidth());
      setBrowserZoom(getBrowserZoom());
    }
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return {
    layoutWidth,
    browserZoom,
    isSm: layoutWidth >= 640,
    isMd: layoutWidth >= 768,
    isLg: layoutWidth >= 1024,
  };
}

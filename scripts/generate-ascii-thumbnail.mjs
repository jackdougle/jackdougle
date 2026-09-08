#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RAMP = " .,:;irsXA253hMHGS#9B&@";
const FONT_PATH = "/System/Library/Fonts/Menlo.ttc";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const value = argv[i + 1];
    if (!key || value == null) fail(`Invalid argument near ${argv[i] ?? "end"}`);
    args[key] = value;
  }
  for (const key of ["input", "reference", "output"]) {
    if (!args[key]) fail(`Missing required --${key}`);
  }
  return {
    ...args,
    columns: Number(args.columns ?? 240),
    referenceMix: Number(args["reference-mix"] ?? 0.75),
    saturation: Number(args.saturation ?? 1.1),
    brightness: Number(args.brightness ?? 1.12),
    densityGamma: Number(args["density-gamma"] ?? 0.58),
    glyphFloor: Number(args["glyph-floor"] ?? 145),
    background: args.background ?? "none",
  };
}

function runMagick(args, options = {}) {
  const result = spawnSync("magick", args, {
    encoding: options.encoding,
    input: options.input,
    maxBuffer: 128 * 1024 * 1024,
  });
  if (result.status !== 0) {
    fail(result.stderr?.toString() || `magick failed: ${args.join(" ")}`);
  }
  return result.stdout;
}

function dimensions(path) {
  const result = runMagick(["identify", "-format", "%w %h", path], {
    encoding: "utf8",
  });
  const [width, height] = result.trim().split(/\s+/).map(Number);
  return { width, height };
}

function sample(path, columns, rows) {
  return runMagick([
    path,
    "-auto-orient",
    "-filter",
    "Box",
    "-resize",
    `${columns}x${rows}!`,
    "-colorspace",
    "sRGB",
    "-depth",
    "8",
    "rgb:-",
  ]);
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function colorAt(
  original,
  reference,
  offset,
  referenceMix,
  saturation,
  brightness,
  tone,
  glyphFloor,
) {
  const mix = (a, b) => a + (b - a) * referenceMix;
  let r = mix(original[offset], reference[offset]);
  let g = mix(original[offset + 1], reference[offset + 1]);
  let b = mix(original[offset + 2], reference[offset + 2]);
  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  r = clamp((gray + (r - gray) * saturation) * brightness);
  g = clamp((gray + (g - gray) * saturation) * brightness);
  b = clamp((gray + (b - gray) * saturation) * brightness);
  const peak = Math.max(r, g, b);
  const targetPeak = glyphFloor + tone * (255 - glyphFloor);
  if (peak > 0 && peak < targetPeak) {
    const scale = targetPeak / peak;
    r = clamp(r * scale);
    g = clamp(g * scale);
    b = clamp(b * scale);
  }
  return [r, g, b];
}

function hex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function escapeMvg(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { width, height } = dimensions(options.reference);
  const cellWidth = width / options.columns;
  const rows = Math.max(1, Math.round(height / (cellWidth / 0.62)));
  const cellHeight = height / rows;
  const fontSize = cellHeight * 0.91;
  const original = sample(options.input, options.columns, rows);
  const reference = sample(options.reference, options.columns, rows);

  const glyphs = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < options.columns; column += 1) {
      const offset = (row * options.columns + column) * 3;
      const sourceLuma =
        (0.2126 * original[offset] +
          0.7152 * original[offset + 1] +
          0.0722 * original[offset + 2]) /
        255;
      const liftedLuma = sourceLuma ** options.densityGamma;
      const tone = Math.max(0, Math.min(1, (liftedLuma - 0.5) * 1.08 + 0.5));
      // Keep every sampled cell represented.  A dot is preferable to a blank
      // cell here: it preserves the source's low-value structure when the
      // thumbnail is viewed up close instead of leaving faint holes.
      const character = RAMP[1 + Math.round(tone * (RAMP.length - 2))];

      const [r, g, b] = colorAt(
        original,
        reference,
        offset,
        options.referenceMix,
        options.saturation,
        options.brightness,
        tone,
        options.glyphFloor,
      );
      const x = (column + 0.5) * cellWidth;
      const y = (row + 0.78) * cellHeight;
      glyphs.push(
        `fill '${hex(r, g, b)}' text ${x.toFixed(2)},${y.toFixed(2)} '${escapeMvg(character)}'`,
      );
    }
  }

  const drawing = `text-anchor middle
${glyphs.join("\n")}`;

  const work = mkdtempSync(join(tmpdir(), "ascii-thumbnail-"));
  const drawingPath = join(work, "render.mvg");
  try {
    writeFileSync(drawingPath, drawing);
    const backgroundArgs = options.background === "original"
      ? [
          options.input,
          "-auto-orient",
          "-filter",
          "Point",
          "-resize",
          `${Math.max(1, Math.round(options.columns / 8))}x${Math.max(1, Math.round(rows / 8))}!`,
          "-scale",
          `${width}x${height}!`,
          "-modulate",
          "100,38,100",
          "-fill",
          "white",
          "-colorize",
          "58%",
        ]
      : ["-size", `${width}x${height}`, `xc:${options.background}`];
    runMagick([
      ...backgroundArgs,
      "-font",
      FONT_PATH,
      "-pointsize",
      fontSize.toFixed(2),
      "-weight",
      "700",
      "-draw",
      `@${drawingPath}`,
      "-colorspace",
      "sRGB",
      "-strip",
      "-depth",
      "8",
      "-dither",
      "None",
      "-colors",
      "256",
      options.output,
    ]);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }

  // Force the output to be read before reporting success.
  readFileSync(options.output);
  console.log(
    `Rendered ${options.columns}x${rows} real ASCII glyphs to ${options.output}`,
  );
}

main();

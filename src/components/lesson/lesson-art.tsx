import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Animated, topic-descriptive lesson artwork. Pure inline SVG + CSS animations
 * (keyframes live in globals.css under `.la-*`), so it renders on the server and
 * respects prefers-reduced-motion. Each lesson maps to a motif + a vivid accent
 * that contrasts with the green UI so the art pops.
 */

export type Motif =
  | "spark"
  | "tokens"
  | "boundary"
  | "shield"
  | "chat"
  | "compass"
  | "layers"
  | "flow"
  | "gauge"
  | "database"
  | "search"
  | "robot"
  | "network"
  | "chip"
  | "coins"
  | "rocket";

type Accent = { from: string; to: string };

const ACCENTS: Record<string, Accent> = {
  violet: { from: "#7c3aed", to: "#a78bfa" },
  indigo: { from: "#4338ca", to: "#818cf8" },
  blue: { from: "#1d4ed8", to: "#60a5fa" },
  cyan: { from: "#0e7490", to: "#22d3ee" },
  teal: { from: "#0d9488", to: "#2dd4bf" },
  emerald: { from: "#047857", to: "#34d399" },
  lime: { from: "#4d7c0f", to: "#a3e635" },
  amber: { from: "#b45309", to: "#fbbf24" },
  orange: { from: "#c2410c", to: "#fb923c" },
  rose: { from: "#be123c", to: "#fb7185" },
  pink: { from: "#be185d", to: "#f472b6" },
  fuchsia: { from: "#a21caf", to: "#e879f9" },
};

const W = 320;
const H = 180;
const CX = 160;
const CY = 92;

function Motifs({ motif }: { motif: Motif }) {
  const w = "#ffffff";
  switch (motif) {
    case "spark":
      return (
        <g fill="none" stroke={w} strokeWidth={3} strokeLinecap="round">
          <circle cx={CX} cy={CY} r={16} fill={w} stroke="none" className="la-pulse" />
          <g className="la-orbit">
            <circle cx={CX} cy={CY - 46} r={5} fill={w} stroke="none" opacity={0.95} />
            <circle cx={CX + 46} cy={CY} r={4} fill={w} stroke="none" opacity={0.8} />
            <circle cx={CX} cy={CY + 46} r={5} fill={w} stroke="none" opacity={0.95} />
            <circle cx={CX - 46} cy={CY} r={4} fill={w} stroke="none" opacity={0.8} />
            <circle cx={CX} cy={CY} r={46} opacity={0.3} />
          </g>
          <g className="la-pulse" opacity={0.9}>
            <path d="M250 40 l0 16 M242 48 l16 0" />
            <path d="M70 130 l0 12 M64 136 l12 0" opacity={0.7} />
          </g>
        </g>
      );
    case "tokens":
      return (
        <g>
          <g fill={w}>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={86 + i * 30}
                y={108}
                width={22}
                height={22}
                rx={5}
                opacity={0.85}
              />
            ))}
          </g>
          <g fill={w}>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={101 + i * 30}
                y={50}
                width={18}
                height={18}
                rx={5}
                className="la-rise"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </g>
          <line x1={70} y1={100} x2={250} y2={100} stroke={w} strokeWidth={2} opacity={0.4} />
        </g>
      );
    case "boundary":
      return (
        <g fill="none" stroke={w} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <rect x={64} y={44} width={192} height={96} rx={12} strokeDasharray="10 12" className="la-dash" opacity={0.55} />
          <g className="la-pulse">
            <path d="M160 62 l30 52 h-60 z" fill={w} stroke="none" />
            <line x1={160} y1={80} x2={160} y2={98} stroke="#000" strokeOpacity={0.25} />
            <circle cx={160} cy={106} r={2.4} fill="#000" fillOpacity={0.25} stroke="none" />
          </g>
        </g>
      );
    case "shield":
      return (
        <g fill="none" stroke={w} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M160 46 l40 16 v34 c0 30 -22 44 -40 52 c-18 -8 -40 -22 -40 -52 v-34 z"
            fill={w}
            fillOpacity={0.16}
            className="la-pulse"
          />
          <path d="M142 94 l13 13 l24 -26" strokeWidth={4} />
        </g>
      );
    case "chat":
      return (
        <g>
          <rect x={64} y={50} width={120} height={56} rx={14} fill={w} opacity={0.9} />
          <path d="M84 106 l0 18 l20 -18 z" fill={w} opacity={0.9} />
          <g fill={ACCENTS.blue.from} className="la-blink">
            <circle cx={100} cy={78} r={5} />
            <circle cx={124} cy={78} r={5} style={{ animationDelay: "0.3s" }} />
            <circle cx={148} cy={78} r={5} style={{ animationDelay: "0.6s" }} />
          </g>
          <g className="la-float">
            <rect x={156} y={92} width={96} height={44} rx={12} fill={w} opacity={0.55} />
            <line x1={170} y1={108} x2={238} y2={108} stroke="#0f172a" strokeOpacity={0.2} strokeWidth={4} strokeLinecap="round" />
            <line x1={170} y1={120} x2={222} y2={120} stroke="#0f172a" strokeOpacity={0.2} strokeWidth={4} strokeLinecap="round" />
          </g>
        </g>
      );
    case "compass":
      return (
        <g fill="none" stroke={w} strokeWidth={3}>
          <circle cx={CX} cy={CY} r={50} opacity={0.85} />
          <circle cx={CX} cy={CY} r={50} strokeDasharray="2 12" opacity={0.5} />
          <g className="la-spin">
            <path d="M160 60 l12 32 l-12 12 l-12 -12 z" fill={w} stroke="none" />
            <path d="M160 124 l12 -32 l-12 -12 l-12 12 z" fill={w} stroke="none" opacity={0.5} />
          </g>
          <circle cx={CX} cy={CY} r={5} fill={w} stroke="none" />
        </g>
      );
    case "layers":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} className="la-float" style={{ animationDelay: `${i * 0.4}s` }}>
              <rect
                x={96}
                y={56 + i * 28}
                width={128}
                height={22}
                rx={7}
                fill={w}
                opacity={0.9 - i * 0.22}
              />
            </g>
          ))}
        </g>
      );
    case "flow":
      return (
        <g fill="none" stroke={w} strokeWidth={3}>
          <path d="M86 92 H160" className="la-dash" />
          <path d="M160 92 H234" className="la-dash" style={{ animationDelay: "0.4s" }} />
          <g stroke="none" fill={w}>
            <rect x={56} y={76} width={32} height={32} rx={8} className="la-pulse" />
            <circle cx={160} cy={92} r={17} className="la-pulse" style={{ animationDelay: "0.3s" }} />
            <rect x={232} y={76} width={32} height={32} rx={8} className="la-pulse" style={{ animationDelay: "0.6s" }} />
          </g>
        </g>
      );
    case "gauge":
      return (
        <g fill="none" stroke={w} strokeWidth={6} strokeLinecap="round">
          <path d="M96 128 A64 64 0 0 1 224 128" opacity={0.35} />
          <path d="M96 128 A64 64 0 0 1 160 64" stroke={w} />
          <g className="la-sweep">
            <line x1={160} y1={128} x2={196} y2={86} strokeWidth={4} />
          </g>
          <circle cx={160} cy={128} r={7} fill={w} stroke="none" />
        </g>
      );
    case "database":
      return (
        <g fill={w}>
          {[0, 1, 2].map((i) => (
            <g key={i} className="la-pulse" style={{ animationDelay: `${i * 0.4}s` }} opacity={0.92 - i * 0.18}>
              <ellipse cx={CX} cy={56 + i * 26} rx={50} ry={13} />
              <rect x={110} y={56 + i * 26} width={100} height={20} />
              <ellipse cx={CX} cy={76 + i * 26} rx={50} ry={13} />
            </g>
          ))}
        </g>
      );
    case "search":
      return (
        <g>
          <g className="la-float">
            <rect x={84} y={48} width={104} height={88} rx={10} fill={w} opacity={0.8} />
            <line x1={100} y1={70} x2={172} y2={70} stroke="#0f172a" strokeOpacity={0.18} strokeWidth={5} strokeLinecap="round" />
            <line x1={100} y1={88} x2={160} y2={88} stroke="#0f172a" strokeOpacity={0.18} strokeWidth={5} strokeLinecap="round" />
            <line x1={100} y1={106} x2={166} y2={106} stroke="#0f172a" strokeOpacity={0.18} strokeWidth={5} strokeLinecap="round" />
          </g>
          <g className="la-sweep" fill="none" stroke={w} strokeWidth={7}>
            <circle cx={196} cy={104} r={24} />
            <line x1={214} y1={122} x2={236} y2={144} strokeLinecap="round" />
          </g>
        </g>
      );
    case "robot":
      return (
        <g fill={w}>
          <g className="la-float">
            <rect x={108} y={66} width={104} height={78} rx={16} />
            <rect x={150} y={44} width={20} height={20} rx={6} />
            <circle cx={160} cy={40} r={7} className="la-pulse" />
            <g fill={ACCENTS.violet.from} className="la-blink">
              <circle cx={138} cy={102} r={9} />
              <circle cx={182} cy={102} r={9} style={{ animationDelay: "0.4s" }} />
            </g>
            <rect x={138} y={122} width={44} height={8} rx={4} fillOpacity={0.5} />
          </g>
        </g>
      );
    case "network":
      return (
        <g>
          <g stroke={w} strokeWidth={2.5} opacity={0.45}>
            <line x1={CX} y1={CY} x2={CX} y2={CY - 50} />
            <line x1={CX} y1={CY} x2={CX + 46} y2={CY + 26} />
            <line x1={CX} y1={CY} x2={CX - 46} y2={CY + 26} />
          </g>
          <circle cx={CX} cy={CY} r={16} fill={w} className="la-pulse" />
          <g fill={w} className="la-orbit">
            <circle cx={CX} cy={CY - 50} r={10} />
            <circle cx={CX + 46} cy={CY + 26} r={10} />
            <circle cx={CX - 46} cy={CY + 26} r={10} />
          </g>
        </g>
      );
    case "chip":
      return (
        <g fill="none" stroke={w} strokeWidth={3} strokeLinecap="round">
          <rect x={112} y={56} width={96} height={72} rx={10} fill={w} fillOpacity={0.14} className="la-pulse" />
          <rect x={134} y={78} width={52} height={28} rx={5} fill={w} stroke="none" opacity={0.85} />
          <g opacity={0.7}>
            {[0, 1, 2].map((i) => (
              <line key={`t${i}`} x1={112} y1={70 + i * 22} x2={92} y2={70 + i * 22} />
            ))}
            {[0, 1, 2].map((i) => (
              <line key={`b${i}`} x1={208} y1={70 + i * 22} x2={228} y2={70 + i * 22} />
            ))}
            {[0, 1, 2].map((i) => (
              <line key={`u${i}`} x1={134 + i * 26} y1={56} x2={134 + i * 26} y2={38} />
            ))}
          </g>
        </g>
      );
    case "coins":
      return (
        <g fill={w}>
          {[0, 1, 2].map((i) => (
            <g key={i} className="la-float" style={{ animationDelay: `${i * 0.45}s` }} opacity={0.95 - i * 0.12}>
              <ellipse cx={CX} cy={132 - i * 26} rx={42} ry={13} />
              <rect x={118} y={120 - i * 26} width={84} height={13} />
              <ellipse cx={CX} cy={120 - i * 26} rx={42} ry={13} />
            </g>
          ))}
          <text x={CX} y={56} textAnchor="middle" fontSize={26} fontWeight="700" fill={w} className="la-pulse">
            $
          </text>
        </g>
      );
    case "rocket":
      return (
        <g>
          <g className="la-float">
            <path d="M160 44 c20 16 26 44 22 70 h-44 c-4 -26 2 -54 22 -70 z" fill={w} />
            <circle cx={160} cy={84} r={9} fill={ACCENTS.teal.from} />
            <path d="M138 108 l-14 18 l20 -4 z" fill={w} opacity={0.8} />
            <path d="M182 108 l14 18 l-20 -4 z" fill={w} opacity={0.8} />
            <path d="M150 118 h20 l-6 22 h-8 z" fill="#fb923c" className="la-blink" />
          </g>
          <g fill={w} className="la-blink" opacity={0.8}>
            <circle cx={84} cy={64} r={3} />
            <circle cx={240} cy={56} r={3} style={{ animationDelay: "0.5s" }} />
            <circle cx={228} cy={120} r={2.5} style={{ animationDelay: "1s" }} />
          </g>
        </g>
      );
    default:
      return null;
  }
}

export function LessonArt({
  motif,
  accent,
  seed,
  className,
}: {
  motif: Motif;
  accent: string;
  seed: string;
  className?: string;
}) {
  const a = ACCENTS[accent] ?? ACCENTS.emerald;
  const uid = `la-${seed}`.replace(/[^a-zA-Z0-9_-]/g, "-");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.from} />
          <stop offset="100%" stopColor={a.to} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="78%" cy="18%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#ffffff" fillOpacity="0.16" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill={`url(#${uid}-bg)`} />
      <rect width={W} height={H} fill={`url(#${uid}-dots)`} />
      <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
      <Motifs motif={motif} />
    </svg>
  );
}

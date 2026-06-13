"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { ArrowRightIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/link-button";
import { Aurora } from "@/components/landing/aurora";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const PHRASES = [
  "first principles.",
  "prompt to production.",
  "models to agents.",
  "theory to real systems.",
  "beginner to builder.",
];

function RotatingPhrase() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="mt-1 flex min-h-[1.15em] items-center justify-center overflow-hidden text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "0.7em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.7em", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient inline-block"
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type FloatCard = {
  src: string;
  alt: string;
  className: string;
  depth: number;
  delay: number;
  rotate: number;
};

const FLOATERS: FloatCard[] = [
  { src: "/hero/hero-tokens.webp", alt: "Tokens", className: "left-[3%] top-[15%] w-40 hidden lg:block", depth: -70, delay: 0, rotate: -7 },
  { src: "/hero/hero-network.webp", alt: "Neural network", className: "right-[4%] top-[11%] w-44 hidden lg:block", depth: -130, delay: 0.15, rotate: 7 },
  { src: "/hero/hero-robot.webp", alt: "AI agent", className: "left-[6%] top-[55%] w-36 hidden lg:block", depth: -160, delay: 0.3, rotate: 4 },
  { src: "/hero/hero-gauge.webp", alt: "Evaluation", className: "right-[6%] top-[58%] w-40 hidden lg:block", depth: -60, delay: 0.2, rotate: -5 },
  { src: "/hero/hero-chip.webp", alt: "Compute", className: "left-[19%] bottom-[9%] w-32 hidden xl:block", depth: -110, delay: 0.4, rotate: 7 },
  { src: "/hero/hero-rocket.webp", alt: "Ship to production", className: "right-[18%] bottom-[7%] w-36 hidden xl:block", depth: -90, delay: 0.35, rotate: -8 },
];

function FloatingArt({
  card,
  scrollY,
  reduced,
}: {
  card: FloatCard;
  scrollY: MotionValue<number>;
  reduced: boolean;
}) {
  const y = useTransform(scrollY, [0, 700], [0, reduced ? 0 : card.depth]);

  return (
    <motion.div
      aria-hidden
      style={{ y, rotate: card.rotate }}
      className={cn("pointer-events-auto absolute z-0", card.className)}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 + card.delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.07, rotate: 0, zIndex: 20, transition: { duration: 0.3 } }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -12, 0] }}
        transition={
          reduced ? undefined : { duration: 6 + card.delay * 3, repeat: Infinity, ease: "easeInOut", delay: card.delay }
        }
        className="overflow-hidden rounded-2xl border border-white/15 shadow-xl ring-1 ring-black/5"
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(min-width: 1280px) 11rem, 10rem"
            className="object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  const contentY = useTransform(scrollY, [0, 500], [0, reduced ? 0 : 70]);
  const contentOpacity = useTransform(scrollY, [0, 350], [1, reduced ? 1 : 0]);
  const gridY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 120]);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      <Aurora />

      {/* Parallax animated grid layer */}
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="bg-grid mask-radial-fade absolute inset-0 -z-10 opacity-[0.35] dark:opacity-20"
      />

      {/* Floating animated art */}
      {FLOATERS.map((card) => (
        <FloatingArt key={card.src} card={card} scrollY={scrollY} reduced={reduced} />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6"
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex justify-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="glass inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary shadow-sm"
            >
              <motion.span
                animate={reduced ? undefined : { rotate: [0, 15, -15, 0] }}
                transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <SparklesIcon className="size-3.5" />
              </motion.span>
              Your path to AI mastery
            </motion.span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-heading mt-6 flex flex-col text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            <span>Master AI from</span>
            <RotatingPhrase />
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty"
          >
            One interactive path from how models actually work to designing, evaluating, and shipping
            production-ready AI systems and autonomous agents. No hype - genuinely deep.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <LinkButton href="/learn/1/1.1" size="lg" className="h-11 px-5 text-sm">
                Start from the fundamentals
                <ArrowRightIcon />
              </LinkButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <LinkButton href="#curriculum" variant="outline" size="lg" className="h-11 px-5 text-sm">
                Explore the curriculum
              </LinkButton>
            </motion.div>
          </motion.div>

          <motion.p variants={item} className="mt-6 text-xs text-muted-foreground">
            12 levels &middot; from your first prompt to production agents &middot; always free
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
        aria-hidden
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted-foreground/60"
        >
          <ChevronDownIcon className="size-5" />
        </motion.span>
      </motion.div>
    </section>
  );
}

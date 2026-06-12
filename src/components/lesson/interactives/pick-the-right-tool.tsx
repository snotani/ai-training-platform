"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CheckIcon, GripVerticalIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Bucket = "ml" | "dl" | "gen";

const SCENARIOS: { id: string; label: string; answer: Bucket; tip: string }[] = [
  { id: "fraud", label: "Flag fraud in a payments table", answer: "ml", tip: "Tabular data you must audit -> Traditional ML." },
  { id: "transcribe", label: "Transcribe support calls to text", answer: "dl", tip: "Raw audio in -> Deep Learning (speech-to-text)." },
  { id: "emails", label: "Draft personalized sales emails", answer: "gen", tip: "Creating new text -> Generative AI." },
  { id: "forecast", label: "Forecast next quarter's demand", answer: "ml", tip: "Structured history -> Traditional ML." },
  { id: "defects", label: "Spot defects in product photos", answer: "dl", tip: "Raw images -> Deep Learning (vision)." },
  { id: "contracts", label: "Summarize 100-page contracts", answer: "gen", tip: "Condensing language -> Generative AI." },
];

const BUCKETS: { id: Bucket; title: string; desc: string }[] = [
  { id: "ml", title: "Traditional ML", desc: "Predict from tidy tables" },
  { id: "dl", title: "Deep Learning", desc: "Perceive raw images / audio" },
  { id: "gen", title: "Generative AI", desc: "Create & summarize language" },
];

function Chip({ id, label, state }: { id: string; label: string; state?: "correct" | "wrong" }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className={cn(
        "flex w-full touch-none items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm shadow-sm transition-colors",
        "cursor-grab active:cursor-grabbing",
        isDragging && "z-10 opacity-90 shadow-md",
        state === "correct" && "border-emerald-500/50 bg-emerald-500/10",
        state === "wrong" && "border-destructive/50 bg-destructive/10",
        !state && "hover:border-primary/40",
      )}
    >
      <GripVerticalIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {state === "correct" && <CheckIcon className="size-4 shrink-0 text-emerald-600" />}
      {state === "wrong" && <XIcon className="size-4 shrink-0 text-destructive" />}
    </button>
  );
}

function Dropzone({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(className, isOver && "border-primary bg-primary/5 ring-1 ring-primary/30")}
    >
      {children}
    </div>
  );
}

function StaticTray() {
  return (
    <>
      <div className="mb-4 grid gap-2 rounded-xl border border-dashed bg-muted/20 p-3 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            className="flex w-full items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left text-sm shadow-sm"
          >
            <GripVerticalIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {BUCKETS.map((b) => (
          <div key={b.id} className="flex min-h-32 flex-col gap-2 rounded-xl border bg-muted/20 p-3">
            <div>
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-[0.7rem] text-muted-foreground">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function PickTheRightTool() {
  const ctx = useLessonContext();
  const [placement, setPlacement] = React.useState<Record<string, Bucket | "tray">>(
    Object.fromEntries(SCENARIOS.map((s) => [s.id, "tray"])),
  );
  const reportedRef = React.useRef(false);
  // dnd-kit injects accessibility attributes that differ between SSR and
  // client; render drag-and-drop only after mount to avoid hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const allCorrect = SCENARIOS.every((s) => placement[s.id] === s.answer);

  React.useEffect(() => {
    if (allCorrect && !reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("pick-the-right-tool");
    }
  }, [allCorrect, ctx]);

  function onDragEnd(e: DragEndEvent) {
    const over = e.over?.id as Bucket | "tray" | undefined;
    if (!over) return;
    setPlacement((p) => ({ ...p, [e.active.id as string]: over }));
  }

  function reset() {
    setPlacement(Object.fromEntries(SCENARIOS.map((s) => [s.id, "tray"])));
    reportedRef.current = false;
  }

  const tray = SCENARIOS.filter((s) => placement[s.id] === "tray");
  const stateFor = (id: string, answer: Bucket): "correct" | "wrong" | undefined => {
    const p = placement[id];
    if (p === "tray") return undefined;
    return p === answer ? "correct" : "wrong";
  };

  return (
    <InteractiveShell
      title="Pick the right tool"
      subtitle="Drag each task onto the approach that fits best."
      complete={allCorrect}
    >
      {!mounted ? (
        <StaticTray />
      ) : (
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <Dropzone
          id="tray"
          className="mb-4 grid gap-2 rounded-xl border border-dashed bg-muted/20 p-3 sm:grid-cols-2"
        >
          {tray.length === 0 ? (
            <p className="col-span-full py-2 text-center text-xs text-muted-foreground">
              All placed - check the colors below.
            </p>
          ) : (
            tray.map((s) => <Chip key={s.id} id={s.id} label={s.label} />)
          )}
        </Dropzone>

        <div className="grid gap-3 sm:grid-cols-3">
          {BUCKETS.map((b) => {
            const placed = SCENARIOS.filter((s) => placement[s.id] === b.id);
            return (
              <Dropzone
                key={b.id}
                id={b.id}
                className="flex min-h-32 flex-col gap-2 rounded-xl border bg-muted/20 p-3 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{b.desc}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {placed.map((s) => (
                    <Chip key={s.id} id={s.id} label={s.label} state={stateFor(s.id, s.answer)} />
                  ))}
                </div>
              </Dropzone>
            );
          })}
        </div>
      </DndContext>
      )}

      {SCENARIOS.some((s) => stateFor(s.id, s.answer) === "wrong") && (
        <ul className="mt-4 space-y-1.5">
          {SCENARIOS.filter((s) => stateFor(s.id, s.answer) === "wrong").map((s) => (
            <li key={s.id} className="text-xs text-muted-foreground">
              <span className="font-medium text-destructive">{s.label}:</span> {s.tip}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {allCorrect
            ? "All six matched correctly. Nice."
            : `${SCENARIOS.filter((s) => stateFor(s.id, s.answer) === "correct").length}/6 correct`}
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcwIcon /> Reset
        </Button>
      </div>
    </InteractiveShell>
  );
}

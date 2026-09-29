import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Keyboard, MessageSquareText, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { flatBeats, scenes, totalBeats, type SceneId } from "./story";
import { FakeCursor, CLICK_DURATION_MS } from "./FakeCursor";
import { TitleScene, OutroScene } from "./scenes/IntroScenes";
import { HomeScene } from "./scenes/HomeScene";
import { LoginScene } from "./scenes/LoginScene";
import { DofiScene } from "./scenes/DofiScene";
import { MyDofisScene } from "./scenes/MyDofisScene";
import { InternalScene } from "./scenes/InternalScene";

const sceneTransition = {
  initial: { opacity: 0, scale: 1.015, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.99, y: -10 },
  transition: { type: "spring", stiffness: 80, damping: 18 } as const,
};

/** Scener som deler samme side-komponent får samme nøkkel, så siden ikke blinker ved beat-skifte. */
const viewKey: Record<SceneId, string> = {
  title: "title",
  home: "home",
  login: "login",
  dofi: "dofi",
  inventors: "dofi",
  submit: "dofi",
  mydofis: "mydofis",
  internal: "internal",
  accepted: "dofi",
  outro: "outro",
};

export function Presentation() {
  const [index, setIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showCaption, setShowCaption] = useState(true);
  const [auto, setAuto] = useState(false);
  const [cheatSheet, setCheatSheet] = useState(false);
  const [clickedTargets, setClickedTargets] = useState<string[]>([]);

  const beat = flatBeats[index]!;
  const scene = scenes[beat.sceneIndex]!;
  const clickTargets = useMemo(
    () =>
      beat.clickSequence ??
      (beat.cursorTarget ? [{ target: beat.cursorTarget, delayMs: 0 }] : []),
    [beat],
  );

  const [manualClick, setManualClick] = useState<{ target: string; seq: number } | null>(null);
  const pendingAdvanceRef = useRef<number | null>(null);
  const [hoverReady, setHoverReady] = useState(false);
  const hoverReadyRef = useRef(false);
  const awaitingArrivalRef = useRef(false);
  const arrivalFallbackRef = useRef<number | null>(null);

  useEffect(() => {
    hoverReadyRef.current = hoverReady;
  }, [hoverReady]);

  const advance = useCallback(() => setIndex((i) => (i + 1) % totalBeats), []);
  const clearPending = useCallback(() => {
    if (pendingAdvanceRef.current !== null) {
      window.clearTimeout(pendingAdvanceRef.current);
      pendingAdvanceRef.current = null;
    }
    if (arrivalFallbackRef.current !== null) {
      window.clearTimeout(arrivalFallbackRef.current);
      arrivalFallbackRef.current = null;
    }
    awaitingArrivalRef.current = false;
  }, []);
  const prev = useCallback(() => {
    clearPending();
    setIndex((i) => (i - 1 + totalBeats) % totalBeats);
  }, [clearPending]);
  /** Hopp direkte til et steg (fremdriftslinjen). */
  const goTo = useCallback(
    (i: number) => {
      clearPending();
      setIndex(i);
    },
    [clearPending],
  );

  const fireClickAndAdvance = useCallback(() => {
    if (!beat.clickOnAdvance) {
      advance();
      return;
    }
    setManualClick({ target: beat.clickOnAdvance, seq: Date.now() });
    pendingAdvanceRef.current = window.setTimeout(() => {
      pendingAdvanceRef.current = null;
      advance();
    }, beat.advanceDelayMs ?? CLICK_DURATION_MS + 100);
  }, [beat, advance]);

  const next = useCallback(() => {
    if (pendingAdvanceRef.current !== null) return;
    if (beat.clickOnAdvance) {
      if (awaitingArrivalRef.current) return;
      if (hoverReadyRef.current) {
        fireClickAndAdvance();
      } else {
        awaitingArrivalRef.current = true;
        arrivalFallbackRef.current = window.setTimeout(() => {
          if (!awaitingArrivalRef.current) return;
          awaitingArrivalRef.current = false;
          arrivalFallbackRef.current = null;
          fireClickAndAdvance();
        }, 1200);
      }
      return;
    }
    advance();
  }, [beat, advance, fireClickAndAdvance]);

  useEffect(() => {
    if (!hoverReady || !awaitingArrivalRef.current) return;
    awaitingArrivalRef.current = false;
    if (arrivalFallbackRef.current !== null) {
      window.clearTimeout(arrivalFallbackRef.current);
      arrivalFallbackRef.current = null;
    }
    fireClickAndAdvance();
  }, [hoverReady, fireClickAndAdvance]);

  useEffect(() => {
    if (!beat.autoAdvanceOnArrive || !hoverReady) return;
    if (awaitingArrivalRef.current || pendingAdvanceRef.current !== null) return;
    fireClickAndAdvance();
  }, [beat, hoverReady, fireClickAndAdvance]);

  const handleHoverArrive = useCallback(() => setHoverReady(true), []);

  useEffect(
    () => () => {
      if (pendingAdvanceRef.current !== null) window.clearTimeout(pendingAdvanceRef.current);
      if (arrivalFallbackRef.current !== null) window.clearTimeout(arrivalFallbackRef.current);
    },
    [],
  );

  const recordTargetClick = useCallback((target: string) => {
    setClickedTargets((current) => [...current, target]);
  }, []);

  useEffect(() => {
    setClickedTargets([]);
    setHoverReady(false);
    awaitingArrivalRef.current = false;
    if (arrivalFallbackRef.current !== null) {
      window.clearTimeout(arrivalFallbackRef.current);
      arrivalFallbackRef.current = null;
    }
  }, [beat.key]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "Backspace":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "h":
        case "H":
          setShowControls((v) => !v);
          break;
        case "c":
        case "C":
          setShowCaption((v) => !v);
          break;
        case "r":
        case "R":
          goTo(0);
          break;
        case "a":
        case "A":
          setAuto((v) => !v);
          break;
        case "?":
          setCheatSheet((v) => !v);
          break;
        case "Escape":
          setCheatSheet(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(next, beat.autoMs ?? 6000);
    return () => window.clearTimeout(t);
  }, [auto, beat, next]);

  const view = viewKey[scene.id];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-night">
      <AnimatePresence mode="wait">
        {/* `isolate`: overlegg (e-post, modaler) i scenen skal aldri legge seg over klikkflaten. */}
        <motion.div key={view} className="absolute inset-0 isolate" {...sceneTransition}>
          {view === "title" && <TitleScene />}
          {view === "home" && <HomeScene beat={beat.key} />}
          {view === "login" && <LoginScene beat={beat.key} />}
          {view === "dofi" && <DofiScene beat={beat.key} clickedTargets={clickedTargets} />}
          {view === "mydofis" && <MyDofisScene beat={beat.key} />}
          {view === "internal" && <InternalScene beat={beat.key} clickedTargets={clickedTargets} />}
          {view === "outro" && <OutroScene beat={beat.key} />}
        </motion.div>
      </AnimatePresence>

      <FakeCursor
        targets={clickTargets}
        beatId={beat.key}
        onTargetClick={recordTargetClick}
        hoverTarget={beat.clickOnAdvance ?? null}
        manualClick={manualClick}
        onArrive={handleHoverArrive}
      />

      {/* Undertekst */}
      <AnimatePresence mode="wait">
        {showCaption && beat.caption && (
          <motion.div
            key={beat.key}
            className="pointer-events-none absolute bottom-16 left-6 z-50 max-w-[560px] rounded-xl bg-night/88 px-5 py-3.5 text-[14px] leading-snug text-white shadow-[var(--shadow-float)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <span className="mr-2 inline-block rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase">
              {scene.label}
            </span>
            {beat.caption}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presentatør-UI */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex items-center gap-4 px-6 py-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
          >
            <div className="pointer-events-auto mx-auto flex items-center gap-3 rounded-full bg-night/80 px-4 py-2 backdrop-blur-sm">
              {scenes.map((s, si) => (
                <div key={s.id} className="flex items-center gap-1">
                  {s.beats.map((b, bi) => {
                    const isCurrent = b.key === beat.key;
                    const isPast =
                      si < beat.sceneIndex || (si === beat.sceneIndex && bi < beat.beatIndex);
                    const target = flatBeats.find((f) => f.key === b.key)!.globalIndex;
                    return (
                      <button
                        key={b.key}
                        type="button"
                        title={`${s.label} · steg ${bi + 1} av ${s.beats.length}`}
                        aria-label={`${s.label}, steg ${bi + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goTo(target);
                        }}
                        className="group -m-1 p-1"
                      >
                        <span
                          className={cn(
                            "block size-1.5 rounded-full transition-all group-hover:scale-150 group-hover:bg-secondary",
                            isCurrent ? "w-4 bg-secondary" : isPast ? "bg-white/60" : "bg-white/25",
                          )}
                        />
                      </button>
                    );
                  })}
                  {si < scenes.length - 1 && <span className="mx-1.5 h-3 w-px bg-white/25" />}
                </div>
              ))}
            </div>

            <div className="pointer-events-auto absolute right-6 bottom-3 flex items-center gap-2">
              <ControlButton onClick={() => setAuto((v) => !v)}>
                {auto ? <Pause className="size-3" /> : <Play className="size-3" />} Auto
              </ControlButton>
              <ControlButton onClick={() => setShowCaption((v) => !v)} title="Undertekst av/på (C)">
                <MessageSquareText className={cn("size-3.5", !showCaption && "opacity-40")} />
              </ControlButton>
              <ControlButton onClick={() => setCheatSheet((v) => !v)} title="Snarveier (?)">
                <Keyboard className="size-3.5" />
              </ControlButton>
              <ControlButton onClick={() => setShowControls(false)}>
                <EyeOff className="size-3" /> Skjul kontroller
              </ControlButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showControls && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowControls(true);
          }}
          className="absolute right-3 bottom-3 z-50 rounded-full bg-night/10 p-1.5 text-night/40 opacity-30 transition-opacity hover:opacity-100"
        >
          <Eye className="size-3.5" />
        </button>
      )}

      <AnimatePresence>
        {cheatSheet && (
          <motion.div
            className="pointer-events-none absolute top-6 right-6 z-[60] w-72 rounded-xl bg-night/92 p-5 text-[11.5px] text-white shadow-[var(--shadow-float)]"
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 130, damping: 18 }}
          >
            <div className="mb-3 text-[10px] font-semibold tracking-[0.14em] uppercase opacity-70">
              Snarveier
            </div>
            {[
              ["Klikk / Mellomrom / → / Page Down", "Neste steg"],
              ["← / Backspace / Page Up", "Forrige steg"],
              ["H", "Skjul/vis kontroller"],
              ["C", "Undertekst av/på"],
              ["A", "Auto-modus av/på"],
              ["R", "Start på nytt"],
              ["?", "Denne oversikten"],
            ].map(([key, desc]) => (
              <div key={key} className="flex justify-between gap-3 py-1">
                <span className="opacity-60">{desc}</span>
                <span className="font-medium">{key}</span>
              </div>
            ))}
            <div className="mt-3 border-t border-white/15 pt-2 text-[10px] opacity-55">
              Steg {index + 1} av {totalBeats} · {scene.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usynlig klikkflate for fremdrift */}
      <div className="absolute inset-0 z-30 cursor-pointer" onClick={next} />
    </div>
  );
}

function ControlButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center gap-1.5 rounded-full bg-night/80 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-sm"
    >
      {children}
    </button>
  );
}

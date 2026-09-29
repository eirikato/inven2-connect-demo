import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type TargetRect = Point & { width: number; height: number };
type ClickTarget = { target: string; delayMs?: number };

/** Klikk-animasjonens varighet (ms). Navigasjon skal alltid vente på dette. */
export const CLICK_DURATION_MS = 420;
/** Liten buffer så pekeren er visuelt framme før klikket spilles. */
const ARRIVE_BUFFER_MS = 70;
/** Naturlig punkt-til-punkt-bevegelse: distansebasert varighet, balansert ease. */
const MOVE_MIN_MS = 240;
const MOVE_MAX_MS = 720;
const MOVE_BASE_MS = 170;
const MOVE_PER_PX = 0.5;
const MOVE_EASE = [0.42, 0, 0.58, 1] as const;

const startPoint = (): Point => ({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.82 });

function moveDurationMs(from: Point, to: Point) {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  return Math.min(MOVE_MAX_MS, Math.max(MOVE_MIN_MS, MOVE_BASE_MS + dist * MOVE_PER_PX));
}

/** Målet må være synlig og i ro (ferdig scrollet inn) før pekeren beveger seg dit. */
function isSettledInView(el: HTMLElement, last: DOMRect | null) {
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const inView = r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth;
  const settled = last != null && Math.abs(last.top - r.top) < 0.5 && Math.abs(last.left - r.left) < 0.5;
  return inView && settled;
}

/**
 * Simulert musepeker: beveger seg naturlig fra punkt til punkt. Rekkefølgen er
 * streng – bevegelsen fullføres FØR klikket spilles, og (for presentatør-styrte
 * steg) klikket fullføres før navigasjonen skjer.
 */
export function FakeCursor({
  targets,
  beatId,
  onTargetClick,
  hoverTarget,
  manualClick,
  onArrive,
}: {
  targets: ClickTarget[];
  beatId: string;
  onTargetClick?: (target: string) => void;
  /** Selector pekeren hviler over uten automatisk klikk. */
  hoverTarget?: string | null;
  /** Når denne endres, spilles klikk-animasjonen på målet umiddelbart. */
  manualClick?: { target: string; seq: number } | null;
  /** Kalles når pekeren er ferdig framme over hoverTarget. */
  onArrive?: () => void;
}) {
  const [pos, setPos] = useState<Point | null>(null);
  const [ripple, setRipple] = useState<{ id: string; at: Point } | null>(null);
  const [focusRect, setFocusRect] = useState<TargetRect | null>(null);
  const [faded, setFaded] = useState(false);
  const posRef = useRef<Point | null>(null);
  const [moveSec, setMoveSec] = useState(MOVE_MAX_MS / 1000);

  const moveTo = useCallback((to: Point, isCancelled: () => boolean) => {
    const from = posRef.current ?? startPoint();
    const dur = moveDurationMs(from, to);
    setMoveSec(dur / 1000);
    if (posRef.current == null) {
      posRef.current = from;
      setPos(from);
    }
    requestAnimationFrame(() => {
      if (isCancelled()) return;
      posRef.current = to;
      setPos(to);
    });
    return dur;
  }, []);

  const playClick = (el: HTMLElement, id: string) => {
    const r = el.getBoundingClientRect();
    const center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    posRef.current = { x: center.x - 3, y: center.y - 2 };
    setMoveSec(0);
    setPos(posRef.current);
    setFocusRect({ x: r.left, y: r.top, width: r.width, height: r.height });
    setRipple({ id, at: center });
    el.classList.add("script-click-target");
    el.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.965)", filter: "brightness(1.12)", offset: 0.42 },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      { duration: CLICK_DURATION_MS, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
  };

  useEffect(() => {
    setFaded(false);
    setFocusRect(null);
    setRipple(null);
    if (targets.length === 0) return;
    let cancelled = false;
    const timers: number[] = [];
    const intervals: number[] = [];

    const stageClick = ({ target, delayMs = 0 }: ClickTarget, sequenceIndex: number) => {
      const startTimer = window.setTimeout(() => {
        let tries = 0;
        let last: DOMRect | null = null;
        const timer = window.setInterval(() => {
          tries += 1;
          const el = document.querySelector(target) as HTMLElement | null;
          if (!el || cancelled) {
            if (tries > 60 || cancelled) window.clearInterval(timer);
            return;
          }
          if (!isSettledInView(el, last) && tries < 60) {
            last = el.getBoundingClientRect();
            return;
          }
          const r = el.getBoundingClientRect();
          window.clearInterval(timer);
          const to = { x: r.left + r.width / 2 - 3, y: r.top + r.height / 2 - 2 };
          const moveMs = moveTo(to, () => cancelled);

          const clickTimer = window.setTimeout(() => {
            if (cancelled) return;
            playClick(el, `${beatId}-${sequenceIndex}`);
            const actionTimer = window.setTimeout(() => {
              if (!cancelled) onTargetClick?.(target);
            }, CLICK_DURATION_MS);
            timers.push(actionTimer);
            const clearFocusTimer = window.setTimeout(() => {
              if (!cancelled) setFocusRect(null);
            }, CLICK_DURATION_MS + 260);
            timers.push(clearFocusTimer);
            if (sequenceIndex === targets.length - 1) {
              const fadeTimer = window.setTimeout(() => {
                if (!cancelled) setFaded(true);
              }, CLICK_DURATION_MS + 580);
              timers.push(fadeTimer);
            }
          }, moveMs + ARRIVE_BUFFER_MS);
          timers.push(clickTimer);
        }, 90);
        intervals.push(timer);
      }, delayMs);
      timers.push(startTimer);
    };

    targets.forEach(stageClick);
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      intervals.forEach(window.clearInterval);
      setFocusRect(null);
      setRipple(null);
    };
  }, [targets, beatId, onTargetClick, moveTo]);

  // Hvile-modus: pekeren flytter seg til målet og venter på presentatørens trykk.
  useEffect(() => {
    if (!hoverTarget) return;
    let cancelled = false;
    let tries = 0;
    let last: DOMRect | null = null;
    let arriveTimer: number | undefined;
    const timer = window.setInterval(() => {
      tries += 1;
      const el = document.querySelector(hoverTarget) as HTMLElement | null;
      if (!el || cancelled) {
        if (tries > 60 || cancelled) window.clearInterval(timer);
        return;
      }
      if (!isSettledInView(el, last) && tries < 60) {
        last = el.getBoundingClientRect();
        return;
      }
      const r = el.getBoundingClientRect();
      window.clearInterval(timer);
      const to = { x: r.left + r.width / 2 - 3, y: r.top + r.height / 2 - 2 };
      const moveMs = moveTo(to, () => cancelled);
      arriveTimer = window.setTimeout(() => {
        if (!cancelled) onArrive?.();
      }, moveMs + ARRIVE_BUFFER_MS);
    }, 90);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (arriveTimer) window.clearTimeout(arriveTimer);
    };
  }, [hoverTarget, beatId, onArrive, moveTo]);

  // Klikk utløst av presentatørens trykk (synkronisert med sceneskiftet).
  useEffect(() => {
    if (!manualClick) return;
    const el = document.querySelector(manualClick.target) as HTMLElement | null;
    if (!el) return;
    playClick(el, `manual-${manualClick.seq}`);
    const t = window.setTimeout(() => onTargetClick?.(manualClick.target), CLICK_DURATION_MS);
    const clearFocus = window.setTimeout(() => setFocusRect(null), CLICK_DURATION_MS + 260);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(clearFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualClick]);

  if ((targets.length === 0 && !hoverTarget) || !pos) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      <AnimatePresence>
        {focusRect && (
          <motion.span
            key={`${beatId}-${focusRect.x}-${focusRect.y}`}
            className="click-focus-ring absolute rounded-[6px] border-2 border-secondary"
            style={{
              left: focusRect.x - 4,
              top: focusRect.y - 4,
              width: focusRect.width + 8,
              height: focusRect.height + 8,
            }}
            initial={{ opacity: 0, scale: 1.045 }}
            animate={{ opacity: [0, 1, 0.9], scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="absolute top-0 left-0"
        animate={{ x: pos.x, y: pos.y, opacity: faded ? 0 : 1 }}
        transition={{
          x: { type: "tween", duration: moveSec, ease: MOVE_EASE },
          y: { type: "tween", duration: moveSec, ease: MOVE_EASE },
          opacity: { duration: 0.4, ease: "easeOut" },
        }}
      >
        <motion.svg
          key={ripple?.id ?? `${beatId}-ready`}
          width="26"
          height="34"
          viewBox="0 0 26 34"
          className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
          animate={ripple ? { scale: [1, 0.86, 1] } : { scale: 1 }}
          transition={{ duration: 0.36, times: [0, 0.42, 1] }}
        >
          <path
            d="M3 2 L3 26 L9.5 20 L13.8 30 L18.4 27.8 L14.2 18.4 L22 17.6 Z"
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(15,23,42,0.8)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.id}
            className="absolute size-8 rounded-full border-[3px] border-secondary bg-secondary/25"
            style={{ left: ripple.at.x - 16, top: ripple.at.y - 16 }}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

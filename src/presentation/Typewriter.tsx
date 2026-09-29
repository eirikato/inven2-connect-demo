import { useEffect, useRef, useState } from "react";

/**
 * Skriveanimasjon med varierende hastighet per tegn – som ekte tasting.
 * `speed` skalerer tempoet: < 1 er raskere, > 1 er tregere.
 */
export function useTypewriter(text: string, active: boolean, startDelay = 300, speed = 1) {
  const [shown, setShown] = useState("");
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown("");
      setDone(false);
      doneRef.current = false;
      return;
    }
    let i = 0;
    let timer: number;
    const step = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        doneRef.current = true;
        setDone(true);
        return;
      }
      const ch = text[i - 1] ?? "";
      const base = 34;
      const jitter = Math.random() * 40;
      const pause = ch === "." || ch === "," || ch === "@" ? 80 : 0;
      timer = window.setTimeout(step, (base + jitter + pause) * speed);
    };
    timer = window.setTimeout(step, startDelay);
    return () => window.clearTimeout(timer);
  }, [text, active, startDelay, speed]);

  return { shown, done };
}

export function Caret({ className = "bg-ink/70" }: { className?: string }) {
  return (
    <span
      className={`ml-[1px] inline-block h-[1.05em] w-[1.5px] translate-y-[0.15em] animate-pulse ${className}`}
    />
  );
}

/** Ferdig tekst som «skrives» inn i et felt når `active` er sann. */
export function TypedValue({
  text,
  active,
  startDelay = 300,
  speed = 1,
  placeholder,
  className,
}: {
  text: string;
  active: boolean;
  startDelay?: number;
  speed?: number;
  placeholder?: string;
  className?: string;
}) {
  const { shown, done } = useTypewriter(text, active, startDelay, speed);
  if (!active) {
    return <span className={`text-ink-soft/70 ${className ?? ""}`}>{placeholder ?? ""}</span>;
  }
  return (
    <span className={className}>
      {shown}
      {!done && <Caret />}
    </span>
  );
}

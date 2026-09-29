import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 110, damping: 20 } as const;

/** Seksjon i DOFI-skjemaet: overskrift + veiledningshint, som i dofiDetailLayout. */
export function Section({
  title,
  hint,
  children,
  className,
  sectionRef,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  sectionRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={sectionRef} className={cn("card-elevated scroll-mt-4 p-6", className)}>
      <h3 className="text-[17px] font-semibold text-primary">{title}</h3>
      {hint && (
        <div className="mt-1.5 flex items-start gap-1.5 text-[12px] text-ink-soft">
          <Info className="mt-[2px] size-3.5 shrink-0 text-link" />
          <span>{hint}</span>
        </div>
      )}
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

export function FieldLabel({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <span className="text-[12.5px] font-medium text-ink-weak">
        {required && <span className="mr-0.5 text-bad">*</span>}
        {children}
      </span>
      {hint && <div className="text-[11.5px] text-ink-soft italic">{hint}</div>}
    </div>
  );
}

/** Inputfelt-ramme. `id` brukes som klikkmål for den simulerte pekeren. */
export function FieldBox({
  id,
  children,
  multiline,
  className,
  focused,
}: {
  id?: string;
  children: React.ReactNode;
  multiline?: boolean;
  className?: string;
  focused?: boolean;
}) {
  return (
    <div
      id={id}
      className={cn(
        "script-click-target rounded-md border bg-surface px-3 text-[13.5px] leading-relaxed text-ink transition-colors",
        multiline ? "min-h-[72px] py-2.5" : "flex h-10 items-center",
        focused ? "border-secondary ring-2 ring-secondary/25" : "border-hairline",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Tekst som «limes inn» med myk fade – for felt som fylles uten skriveanimasjon. */
export function RevealText({
  show,
  text,
  delay = 0,
  placeholder,
}: {
  show: boolean;
  text: string;
  delay?: number;
  placeholder?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.span
          key="text"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay, ease: "easeOut" }}
        >
          {text}
        </motion.span>
      ) : (
        <span key="ph" className="text-ink-soft/60">
          {placeholder ?? ""}
        </span>
      )}
    </AnimatePresence>
  );
}

/** Ja/nei-velger, som flowToggle i portalen. */
export function YesNo({
  id,
  value,
  yesId,
}: {
  id: string;
  value: "yes" | "no" | null;
  yesId?: string;
}) {
  return (
    <div id={id} className="inline-flex overflow-hidden rounded-md border border-hairline text-[12.5px]">
      {(["yes", "no"] as const).map((opt) => {
        const selected = value === opt;
        return (
          <span
            key={opt}
            id={opt === "yes" ? yesId : undefined}
            className={cn(
              "script-click-target flex h-9 min-w-[72px] items-center justify-center gap-1.5 px-4 transition-colors",
              selected ? "bg-primary font-semibold text-white" : "bg-surface text-ink-weak",
              opt === "yes" && "border-r border-hairline",
            )}
          >
            {selected && <Check className="size-3.5" />}
            {opt === "yes" ? "Yes" : "No"}
          </span>
        );
      })}
    </div>
  );
}

/** Nedtrekksliste for institusjonsleder (kuratert liste). */
export function LeaderPicker({
  id,
  open,
  value,
  options,
  selectedOptionId,
}: {
  id: string;
  open: boolean;
  value: string | null;
  options: Array<{ id: string; name: string; role: string; org: string }>;
  selectedOptionId?: string | undefined;
}) {
  return (
    <div className="relative">
      <FieldBox id={id} focused={open}>
        <span className={cn("flex-1", !value && "text-ink-soft/60")}>
          {value ?? "Search or select institutional leader…"}
        </span>
        <ChevronDown className="size-4 text-ink/50" />
      </FieldBox>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-hairline bg-card shadow-[var(--shadow-float)]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
          >
            {options.map((opt, i) => (
              <motion.div
                key={opt.id}
                id={opt.id}
                className={cn(
                  "script-click-target flex items-center justify-between px-3 py-2.5 text-[13px]",
                  opt.id === selectedOptionId ? "bg-mint/40" : "hover:bg-surface-2",
                )}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                <div>
                  <div className="font-medium text-ink">{opt.name}</div>
                  <div className="text-[11.5px] text-ink-soft">{opt.role}</div>
                </div>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10.5px] text-ink-weak">
                  {opt.org}
                </span>
              </motion.div>
            ))}
            <div className="border-t border-hairline px-3 py-2 text-[12px] text-link">
              Name not listed? Enter manually
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

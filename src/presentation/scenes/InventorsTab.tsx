import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { AlertTriangle, Check, Clock, Mail, Pencil, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "../chrome";
import { employments, inventors, ownership } from "../data";
import { reached, type BeatKey } from "../story";
import { Section } from "./formParts";

const spring = { type: "spring", stiffness: 120, damping: 18 } as const;

export function InventorsTab({
  beat,
  clickedTargets,
  scrollTo,
}: {
  beat: BeatKey;
  clickedTargets: string[];
  scrollTo: (el: HTMLElement | null, block?: ScrollLogicalPosition) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const employmentRef = useRef<HTMLDivElement>(null);
  const ownershipRef = useRef<HTMLDivElement>(null);

  const invited = reached(beat, "inv.email") || clickedTargets.includes("#btn-add-inventor");
  const registered = reached(beat, "inv.registered");
  const showOwnership = reached(beat, "inv.ownership");
  const submitted = reached(beat, "submit.done");

  useEffect(() => {
    switch (beat) {
      case "inv.list":
      case "inv.add":
      case "inv.email":
      case "inv.registered":
        scrollTo(listRef.current, "start");
        break;
      case "inv.employment":
        scrollTo(employmentRef.current, "start");
        break;
      case "inv.ownership":
        scrollTo(ownershipRef.current, "center");
        break;
    }
  }, [beat, scrollTo]);

  return (
    <div className="space-y-5 pb-[60vh]">
      <Section
        sectionRef={listRef}
        title="Inventors"
        hint="Everyone who contributed to the inventive concept must be listed. Co-inventors are invited by e-mail and register themselves."
      >
        <div className="divide-y divide-hairline overflow-hidden rounded-md border border-hairline">
          {inventors.map((inv, i) => {
            const isSubmitter = inv.role === "Submitter";
            const visible = isSubmitter || invited;
            if (!visible) return null;
            const status = isSubmitter || registered ? "Registered" : "Invited";
            return (
              <motion.div
                key={inv.email}
                className="flex items-center gap-4 bg-card px-4 py-3"
                initial={isSubmitter ? false : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: isSubmitter ? 0 : 0.15 + i * 0.18 }}
              >
                <Avatar initials={inv.initials} color={inv.color} />
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-ink">{inv.name}</div>
                  <div className="text-[12px] text-ink-soft">{inv.email}</div>
                </div>
                <span className="w-24 text-[12px] text-ink-weak">{inv.org}</span>
                <span
                  className={cn(
                    "w-24 rounded-full px-2.5 py-0.5 text-center text-[11px] font-semibold",
                    isSubmitter ? "bg-primary/12 text-primary" : "bg-surface-3 text-ink-weak",
                  )}
                >
                  {inv.role}
                </span>
                <motion.span
                  key={status}
                  className={cn(
                    "inline-flex w-28 items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    status === "Registered" ? "bg-ok/12 text-ok" : "bg-warn/12 text-warn",
                  )}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...spring, delay: status === "Registered" && !isSubmitter ? 0.4 + i * 0.3 : 0 }}
                >
                  {status === "Registered" ? <Check className="size-3" /> : <Clock className="size-3" />}
                  {status}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
        {!submitted && (
          <div className="flex items-center gap-4">
            <span
              id="btn-add-inventor"
              className="script-click-target inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white"
            >
              <UserPlus className="size-4" /> Add inventor
            </span>
            <AnimatePresence>
              {beat === "inv.add" && invited && (
                <motion.span
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-ok"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Mail className="size-4" /> Invitations sent to 2 co-inventors
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
        <AnimatePresence>
          {beat === "inv.registered" && (
            <motion.div
              className="flex items-start gap-2 rounded-md border-l-4 border-link bg-callout px-4 py-3 text-[12.5px] text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <AlertTriangle className="mt-[1px] size-4 shrink-0 text-link" />
              <span>
                <strong>Amir Haddad</strong> and <strong>Marte Lien</strong> have registered as
                co-inventors. If you do not recognise a person, you can remove them before
                submission.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Section
        sectionRef={employmentRef}
        title="Your Employment"
        hint="Important: Your employment at the time of making an invention determines institutional ownership of the DOFI. Please keep your employment details up to date."
      >
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-semibold text-ink-weak">
            Current Employment <span className="text-ink-soft">(2 of 3)</span>
          </h4>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12px] text-ink-weak">
            <Plus className="size-3.5" /> Add Employment
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {employments.map((e, i) => (
            <motion.div
              key={e.employer}
              className="rounded-md border border-hairline bg-surface p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.12 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{e.employer}</div>
                  <div className="text-[12px] text-ink-soft">{e.unit}</div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[12px] font-bold text-white",
                    i === 0 ? "bg-primary" : "bg-secondary",
                  )}
                >
                  {e.fraction}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[11.5px]">
                <div>
                  <dt className="text-ink-soft">Fraction</dt>
                  <dd className="font-medium text-ink">{e.fraction}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Start Date</dt>
                  <dd className="font-medium text-ink">{e.start}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft">Role</dt>
                  <dd className="font-medium text-ink">{e.role}</dd>
                </div>
              </dl>
              <div className="mt-3 flex gap-3 text-[12px] text-link">
                <span className="inline-flex items-center gap-1">
                  <Pencil className="size-3" /> Edit
                </span>
                <span>End Position</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-[12px] text-ink-soft">
          Employment History · <span className="text-link">Show</span>
        </div>
      </Section>

      <div ref={ownershipRef} className="scroll-mt-4">
        <AnimatePresence>
          {showOwnership && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              <Section
                title="Institutional ownership (calculated)"
                hint="Calculated automatically from all inventors' employment at the time of invention. Inven2 uses this when preparing ownership and inventorship agreements."
              >
                <div className="flex h-5 overflow-hidden rounded-full bg-surface-3">
                  {ownership.map((o, i) => (
                    <motion.div
                      key={o.institution}
                      className={cn("flex items-center justify-center text-[11px] font-bold text-white", o.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${o.share}%` }}
                      transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                    >
                      {o.share} %
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12.5px]">
                  {ownership.map((o) => (
                    <div key={o.institution} className="flex items-center gap-2">
                      <span className={cn("size-3 rounded-sm", o.color)} />
                      <span className="text-ink">{o.institution}</span>
                      <span className="ml-auto font-semibold text-ink">{o.share} %</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 text-[11.5px] text-ink-soft">
                  <span>Ingrid Solheim · OUS 80 % / UiO 20 %</span>
                  <span>Amir Haddad · UiO 100 %</span>
                  <span>Marte Lien · OUS 100 %</span>
                </div>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

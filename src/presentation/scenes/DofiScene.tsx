import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { Check, CheckCircle2, ChevronRight, FileText, Home, Info, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BrowserFrame,
  ConnectHeader,
  EmailButton,
  EmailCallout,
  EmailOverlay,
  StageBadge,
  Toast,
} from "../chrome";
import { dofi, inven2, stages, type Stage } from "../data";
import { reached, type BeatKey } from "../story";
import { DofiDetailsTab } from "./DofiDetailsTab";
import { InventorsTab } from "./InventorsTab";

const spring = { type: "spring", stiffness: 110, damping: 18 } as const;

export function DofiScene({ beat, clickedTargets }: { beat: BeatKey; clickedTargets: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((el: HTMLElement | null, block: ScrollLogicalPosition = "start") => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block });
  }, []);

  // Innsendings- og beslutningsstegene skal vise sidehodet (status, path, knapp).
  useEffect(() => {
    if (beat.startsWith("submit.") || beat.startsWith("acc.")) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [beat]);

  const isAccepted = reached(beat, "acc.email");
  const isSubmitted = reached(beat, "submit.done");
  const stage: Stage = isAccepted ? "Accepted" : isSubmitted ? "Submitted" : "Draft";
  const tab: "details" | "inventors" =
    beat.startsWith("inv.") || beat.startsWith("submit.") ? "inventors" : "details";
  const hasTitle = reached(beat, "dofi.leader");
  const submitReady = reached(beat, "submit.ready") && !isSubmitted;
  const showReadiness = beat === "submit.ready";
  const showSubmittedModal = beat === "submit.done";
  const showHistory = beat === "acc.portal";

  const heading = isAccepted
    ? `DOFI ${dofi.number} · ${dofi.title}`
    : hasTitle
      ? dofi.title
      : "New DOFI";

  return (
    <BrowserFrame url={`https://inven2.my.site.com/connect/s/newdofi/${dofi.id.toLowerCase()}`}>
      <ConnectHeader active={tab === "details" && !isAccepted && !isSubmitted ? "create" : "mydofis"} />

      <div ref={scrollRef} className="scroll-slim relative flex-1 overflow-y-auto bg-sf-bg">
        <div className="mx-auto max-w-[1100px] px-8 pt-6">
          {/* Brødsmuler */}
          <div className="flex items-center gap-1.5 text-[12px] text-ink-soft">
            <Home className="size-3.5" />
            <ChevronRight className="size-3" />
            <span>My DOFIs</span>
            <ChevronRight className="size-3" />
            <span className="text-ink">{dofi.id}</span>
          </div>

          {/* Sidehode */}
          <motion.div
            className="mt-3 flex items-start justify-between gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <div>
              <div className="flex items-center gap-3">
                <motion.h1 key={heading} className="text-[26px] font-semibold text-ink" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
                  {heading}
                </motion.h1>
                <StageBadge stage={stage} />
              </div>
              <div className="mt-1 text-[12.5px] text-ink-soft">
                {dofi.id} · Created {dofi.created} by {dofi.submitter}
                {isSubmitted && ` · Submitted ${dofi.submitted}`}
              </div>
            </div>

            <div className="relative shrink-0">
              {isSubmitted ? (
                <motion.span
                  className="inline-flex items-center gap-1.5 rounded-md bg-ok/12 px-4 py-2.5 text-[13px] font-semibold text-ok"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={spring}
                >
                  <CheckCircle2 className="size-4" /> {isAccepted ? "Accepted by Inven2" : "DOFI Submitted"}
                </motion.span>
              ) : (
                <motion.span
                  id="btn-submit"
                  className={cn(
                    "script-click-target inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-semibold transition-colors",
                    submitReady ? "bg-primary text-white shadow-md" : "bg-surface-3 text-ink-soft",
                  )}
                  animate={
                    submitReady && showReadiness
                      ? { boxShadow: ["0 0 0 0 rgb(204 69 125 / 0)", "0 0 0 8px rgb(204 69 125 / 0.25)", "0 0 0 0 rgb(204 69 125 / 0)"] }
                      : {}
                  }
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  <Send className="size-4" /> Submit DOFI
                </motion.span>
              )}

              <AnimatePresence>
                {showReadiness && (
                  <motion.div
                    className="absolute top-full right-0 z-30 mt-2 w-[330px] rounded-lg border border-hairline bg-card p-4 shadow-[var(--shadow-float)]"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={spring}
                  >
                    <div className="text-[12px] font-semibold tracking-wide text-ink-weak uppercase">
                      Ready to submit
                    </div>
                    <ul className="mt-2 space-y-1.5 text-[12.5px] text-ink">
                      {[
                        "All required fields completed",
                        "Institutional leader selected",
                        "All co-inventors registered",
                        "Employment confirmed by all inventors",
                      ].map((t, i) => (
                        <motion.li
                          key={t}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.25 }}
                        >
                          <Check className="size-4 text-ok" /> {t}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stage path */}
          <StagePath stage={stage} accepted={isAccepted} />

          {/* Veiledning */}
          {!isSubmitted && (
            <div className="mt-5 flex items-start gap-2 rounded-r-md border-l-4 border-primary bg-callout-pink px-4 py-3 text-[12.5px] text-ink">
              <Info className="mt-[1px] size-4 shrink-0 text-primary" />
              <span>
                Fill in the sections below. Fields marked <span className="text-bad">*</span> are
                required before submission. Your draft is saved automatically – you can return at any
                time.
              </span>
            </div>
          )}

          {showHistory && <HistoryCard />}

          {/* Tabs */}
          <div className="mt-5 flex gap-1 border-b border-hairline text-[13.5px]">
            {[
              { id: "tab-details", key: "details", label: "DOFI Details" },
              { id: "tab-inventors", key: "inventors", label: "Inventor Details" },
              ...(isSubmitted ? [{ id: "tab-chatter", key: "chatter", label: "Chatter" }] : []),
            ].map((t) => (
              <span
                key={t.key}
                id={t.id}
                className={cn(
                  "script-click-target relative px-4 py-2.5 font-medium",
                  t.key === tab ? "text-primary" : "text-ink-weak",
                )}
              >
                {t.label}
                {t.key === tab && (
                  <motion.span layoutId="dofi-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-primary" />
                )}
              </span>
            ))}
          </div>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "details" ? (
                  <DofiDetailsTab beat={beat} clickedTargets={clickedTargets} scrollTo={scrollTo} />
                ) : (
                  <InventorsTab beat={beat} clickedTargets={clickedTargets} scrollTo={scrollTo} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <Toast
        show={beat === "dofi.files" && clickedTargets.includes("#btn-upload")}
        title="Draft saved"
        body="Your changes are saved automatically."
      />

      {/* «DOFI Submitted!» */}
      <AnimatePresence>
        {showSubmittedModal && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-night/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[520px] rounded-xl bg-card p-10 text-center shadow-[var(--shadow-float)]"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={spring}
            >
              <motion.span
                className="mx-auto flex size-16 items-center justify-center rounded-full bg-ok/12 text-ok"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              >
                <CheckCircle2 className="size-9" />
              </motion.span>
              <h2 className="mt-5 text-[26px] font-semibold text-ink">DOFI Submitted!</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-weak">
                Your DOFI has been successfully submitted for evaluation. A PDF summary will be
                emailed to all inventors shortly.
              </p>
              <div className="mt-7 flex justify-center gap-6 text-[13px] font-semibold text-link">
                <span className="inline-flex items-center gap-1.5">
                  <Home className="size-4" /> Go to Home
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Plus className="size-4" /> Create another DOFI
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E-poster */}
      <EmailOverlay
        show={beat === "inv.email"}
        to="amir.haddad@farmasi.uio.no"
        subject="Invitation to contribute to DOFI draft"
      >
        <p>Dear Amir Haddad,</p>
        <p className="mt-2">
          You have been added as an inventor on a DOFI draft by <strong>{dofi.submitter}</strong>.
        </p>
        <EmailCallout>
          <div>
            <span className="text-ink-soft">Draft ID:</span> <strong>{dofi.id}</strong>
          </div>
          <div>
            <span className="text-ink-soft">Title:</span> <strong>{dofi.title}</strong>
          </div>
        </EmailCallout>
        <p>
          Please register on Inven2 Connect to review the draft, confirm your employment details
          and contribute before submission. The link below is personal and valid for 30 days.
        </p>
        <EmailButton>Register and open the DOFI draft</EmailButton>
      </EmailOverlay>

      <EmailOverlay
        show={beat === "submit.email"}
        to="ingrid.solheim@ous-hf.no, amir.haddad@farmasi.uio.no, marte.lien@ous-hf.no"
        subject={`Your DOFI has been submitted for approval - ${dofi.id}`}
        attachment={`DOFI_${dofi.id}_${dofi.submitted.replaceAll(".", "")}.pdf`}
      >
        <p>Dear inventors,</p>
        <p className="mt-2">Your DOFI has now been submitted for approval.</p>
        <EmailCallout>
          <div>
            <span className="text-ink-soft">DOFI:</span> <strong>{dofi.id}</strong>
          </div>
          <div>
            <span className="text-ink-soft">Title:</span> <strong>{dofi.title}</strong>
          </div>
          <div>
            <span className="text-ink-soft">Submitted by:</span> {dofi.submitter}, {dofi.submitted}
          </div>
        </EmailCallout>
        <p>
          A PDF summary of the full disclosure is attached for your records. Inven2 will review the
          submission and you will receive a receipt with a DOFI number once it has been approved for
          evaluation.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-2 text-[12px]">
          <FileText className="size-4 text-bad" /> DOFI_{dofi.id}_{dofi.submitted.replaceAll(".", "")}.pdf
        </div>
      </EmailOverlay>

      <EmailOverlay
        show={beat === "acc.email"}
        to="ingrid.solheim@ous-hf.no, amir.haddad@farmasi.uio.no, marte.lien@ous-hf.no"
        subject={`Your DOFI has been accepted - ${dofi.number} ${dofi.title}`}
      >
        <p>Dear inventors,</p>
        <p className="mt-2">
          We are pleased to inform you that your invention disclosure (DOFI {dofi.number}) “
          {dofi.title}” has been evaluated and <strong>accepted</strong> by Inven2.
        </p>
        <EmailCallout>
          As a next step, you will receive agreements for signature regarding{" "}
          <strong>inventorship</strong> and the <strong>right to your invention</strong>. Your
          project manager, {inven2.projectManager}, will contact you shortly to plan the way
          forward.
        </EmailCallout>
        <p>Congratulations – we look forward to working with you.</p>
        <EmailButton>View Record</EmailButton>
      </EmailOverlay>
    </BrowserFrame>
  );
}

function StagePath({ stage, accepted }: { stage: Stage; accepted: boolean }) {
  const current = stages.indexOf(stage as (typeof stages)[number]);
  const dates: Record<string, string> = {
    Draft: dofi.created,
    Submitted: dofi.submitted,
    "Under Evaluation": dofi.receipt,
    Accepted: dofi.accepted,
  };
  return (
    <div className="mt-5 flex overflow-hidden rounded-md border border-hairline bg-card text-[12px]">
      {stages.map((s, i) => {
        const done = i < current || (accepted && s === "Accepted");
        const active = i === current;
        return (
          <div
            key={s}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 py-2.5 font-medium",
              done ? "bg-teal text-white" : active ? "bg-primary text-white" : "bg-surface text-ink-soft",
              i < stages.length - 1 && "border-r border-white/40",
            )}
          >
            {done && <Check className="size-3.5" />}
            <span>{s}</span>
            {(done || active) && accepted && (
              <span className="text-[10.5px] opacity-80">· {dates[s]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HistoryCard() {
  const items = [
    { date: dofi.created, text: "Draft created by Ingrid Solheim", who: "IS" },
    { date: "14.03.2026", text: "Amir Haddad and Marte Lien registered as co-inventors", who: "AH" },
    { date: dofi.submitted, text: "DOFI submitted for approval · PDF summary sent to all inventors", who: "IS" },
    { date: dofi.receipt, text: `Approved for evaluation · DOFI number ${dofi.number} · Project manager ${inven2.projectManager}`, who: "JB" },
    { date: "07.04.2026", text: "Chatter: dose–response question answered", who: "IS" },
    { date: dofi.accepted, text: "Accepted as standard project · agreements to follow", who: "JB" },
  ];
  return (
    <motion.div
      className="card-elevated mt-5 p-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <h3 className="text-[17px] font-semibold text-primary">History</h3>
      <ol className="mt-4 space-y-0">
        {items.map((it, i) => (
          <motion.li
            key={it.date + it.text}
            className="relative flex gap-4 pb-4 pl-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.16 }}
          >
            {i < items.length - 1 && (
              <span className="absolute top-5 left-[13px] h-full w-px bg-hairline" />
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                i === items.length - 1 ? "bg-ok" : "bg-teal",
              )}
            >
              {it.who}
            </span>
            <div>
              <div className="text-[11.5px] text-ink-soft">{it.date}</div>
              <div className="text-[13px] text-ink">{it.text}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

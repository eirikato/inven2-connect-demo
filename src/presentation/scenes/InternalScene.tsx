import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronDown,
  FileText,
  Grid3X3,
  Lightbulb,
  Mail,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, EmailButton, EmailCallout, EmailOverlay, Toast } from "../chrome";
import { dofi, inven2, inventors, ownership, stages, type Stage } from "../data";
import { reached, type BeatKey } from "../story";

const spring = { type: "spring", stiffness: 120, damping: 18 } as const;

export function InternalScene({ beat, clickedTargets }: { beat: BeatKey; clickedTargets: string[] }) {
  const reviewClicked = clickedTargets.includes("#qa-review");
  const acceptClicked = clickedTargets.includes("#qa-accept");
  const [reviewDone, setReviewDone] = useState(false);

  // Godkjenningen «prosesseres» et øyeblikk etter klikket før status skifter.
  useEffect(() => {
    if (reached(beat, "int.receipt")) {
      setReviewDone(true);
      return;
    }
    if (beat === "int.review" && reviewClicked) {
      const t = window.setTimeout(() => setReviewDone(true), 1100);
      return () => window.clearTimeout(t);
    }
    setReviewDone(false);
    return undefined;
  }, [beat, reviewClicked]);

  const accepted = acceptClicked;
  const stage: Stage = accepted ? "Accepted" : reviewDone ? "Under Evaluation" : "Submitted";
  const showChatter = reached(beat, "int.chatter");

  return (
    <div className="flex size-full flex-col bg-sf-bg text-ink">
      {/* Lightning-topp */}
      <div className="flex h-[50px] shrink-0 items-center gap-4 bg-teal-dark px-4 text-white">
        <Grid3X3 className="size-5 opacity-80" />
        <span className="text-[15px] font-semibold">Inven2 Innovation</span>
        <div className="ml-6 flex items-center gap-5 text-[13px] opacity-90">
          <span className="rounded-t-md border-b-2 border-white pb-[13px] pt-[15px] font-medium">NewDOFIs</span>
          <span>DOFI Projects</span>
          <span>Patent Families</span>
          <span>Reports</span>
        </div>
        <div className="ml-auto flex w-[340px] items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-[12.5px]">
          <Search className="size-4" /> Search...
        </div>
        <Star className="size-4 opacity-80" />
        <Bell className="size-4 opacity-80" />
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold">
          {inven2.evaluationManager.split(" ").map((n) => n[0]).join("")}
        </span>
      </div>

      <div className="scroll-slim flex-1 overflow-y-auto p-4">
        {/* Highlights-panel */}
        <motion.div
          className="rounded-md border border-hairline bg-card p-4 shadow-[var(--shadow-card)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div className="flex items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-md bg-primary text-white">
              <Lightbulb className="size-6" />
            </span>
            <div>
              <div className="text-[12px] text-ink-soft">NewDOFI</div>
              <h1 className="text-[20px] font-semibold">{dofi.title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <AnimatePresence mode="popLayout">
                {stage === "Submitted" && (
                  <QuickAction key="review" id="qa-review" primary>
                    Review Submission
                  </QuickAction>
                )}
                {stage === "Under Evaluation" && (
                  <>
                    <QuickAction key="accept" id="qa-accept" primary>
                      Accept DOFI
                    </QuickAction>
                    <QuickAction key="reject">Reject DOFI</QuickAction>
                    <QuickAction key="sub">Accept as Sub-Project</QuickAction>
                  </>
                )}
                {stage === "Accepted" && (
                  <QuickAction key="proj">Create DOFI Project</QuickAction>
                )}
              </AnimatePresence>
              <span className="flex h-8 items-center rounded-md border border-hairline px-2">
                <ChevronDown className="size-4" />
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-6 text-[12.5px]">
            <Highlight label="DOFI Id" value={dofi.id} />
            <Highlight label="DOFI Number">
              <AnimatePresence mode="wait">
                {reviewDone ? (
                  <CountUp key="num" to={Number(dofi.number)} animate={beat === "int.review"} />
                ) : (
                  <span key="none" className="text-ink-soft">
                    —
                  </span>
                )}
              </AnimatePresence>
            </Highlight>
            <Highlight label="DOFI Stage" value={stage} />
            <Highlight label="Evaluation Manager" value={inven2.evaluationManager} />
            <Highlight label="Project Manager">
              <AnimatePresence mode="wait">
                {reviewDone ? (
                  <motion.span key="pm" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: beat === "int.review" ? 0.6 : 0 }}>
                    {inven2.projectManager}
                  </motion.span>
                ) : (
                  <span key="nopm" className="text-ink-soft">
                    —
                  </span>
                )}
              </AnimatePresence>
            </Highlight>
            <Highlight label="Submitted" value={dofi.submitted} />
          </div>
        </motion.div>

        {/* Path */}
        <div className="mt-3 flex overflow-hidden rounded-md border border-hairline bg-card text-[12.5px] font-medium">
          {stages.map((s, i) => {
            const idx = stages.indexOf(stage as (typeof stages)[number]);
            const done = i < idx || (stage === "Accepted" && s === "Accepted");
            const active = i === idx && !done;
            return (
              <div
                key={s}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 py-2.5 transition-colors",
                  done ? "bg-teal text-white" : active ? "bg-sf-blue text-white" : "bg-surface text-ink-soft",
                  i < stages.length - 1 && "border-r border-white/40",
                )}
              >
                {done && <Check className="size-3.5" />}
                {s}
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
          {/* Venstre: detaljer */}
          <div className="space-y-3">
            <Card title="Details">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12.5px]">
                <Detail label="Invention title" value={dofi.title} />
                <Detail label="Submitter" value={dofi.submitter} />
                <Detail label="Main Institutional Leader" value={`${dofi.leader.name} (OUS)`} />
                <Detail label="Additional Institutional Leaders" value={`${dofi.additionalLeader.name} (UiO)`} />
                <Detail label="The DOFI includes software" value="No" />
                <Detail label="Status (decision)" value={accepted ? "Accept as standard project" : "Evaluation"} highlight={accepted} />
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-r-md border-l-4 border-warn bg-warn/10 px-3 py-2.5 text-[12.5px]">
                <AlertTriangle className="mt-[1px] size-4 shrink-0 text-warn" />
                <span>
                  <strong>Public disclosure planned:</strong> {dofi.disclosurePlan} → prioritise patent filing.
                </span>
              </div>
            </Card>

            <Card title="Ownership (calculated)">
              <div className="flex h-4 overflow-hidden rounded-full bg-surface-3">
                {ownership.map((o) => (
                  <div key={o.institution} className={cn("flex items-center justify-center text-[10.5px] font-bold text-white", o.color)} style={{ width: `${o.share}%` }}>
                    {o.share} %
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-6 text-[12px] text-ink-weak">
                {ownership.map((o) => (
                  <span key={o.institution} className="inline-flex items-center gap-1.5">
                    <span className={cn("size-2.5 rounded-sm", o.color)} /> {o.institution}
                  </span>
                ))}
              </div>
            </Card>

            <Card title={`Inventors (${inventors.length})`}>
              <table className="w-full text-left text-[12.5px]">
                <thead className="text-[11px] text-ink-soft uppercase">
                  <tr>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Employer(s)</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Employment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {inventors.map((inv) => (
                    <tr key={inv.email}>
                      <td className="py-2 font-medium text-link">{inv.name}</td>
                      <td className="py-2 text-ink-weak">{inv.org}</td>
                      <td className="py-2 text-ink-weak">{inv.role}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1 text-ok">
                          <Check className="size-3.5" /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Høyre: Chatter + filer */}
          <div className="space-y-3">
            <Card title="Chatter">
              <div className="rounded-md border border-hairline bg-surface px-3 py-2 text-[12.5px] text-ink-soft">
                Share an update or ask the inventors a question…
              </div>
              <div className="mt-3 space-y-3">
                <AnimatePresence>
                  {showChatter && (
                    <ChatterPost
                      key="q"
                      initials="JB"
                      color="bg-teal"
                      name={inven2.projectManager}
                      meta="Inven2 · 07.04.2026 09:12"
                      delay={beat === "int.chatter" ? 0.4 : 0}
                      notified
                    >
                      Hei Ingrid – takk for en grundig DOFI! Har dere dose–respons-data fra
                      rottemodellen utover 12 uker, eller er det planlagt? Det er viktig for
                      patentstrategien.
                    </ChatterPost>
                  )}
                  {showChatter && (
                    <ChatterPost
                      key="a"
                      initials="IS"
                      color="bg-primary"
                      name={dofi.submitter}
                      meta="Inven2 Connect · 07.04.2026 14:48"
                      delay={beat === "int.chatter" ? 3.2 : 0}
                      reply
                    >
                      Hei Jonas! Vi har en 24-ukers studie som avsluttes i mai. Foreløpige data ser
                      lovende ut – jeg laster opp interimrapporten på DOFIen i dag.
                    </ChatterPost>
                  )}
                </AnimatePresence>
                {!showChatter && (
                  <div className="py-6 text-center text-[12px] text-ink-soft">No posts yet.</div>
                )}
              </div>
            </Card>

            <Card title="Files (1)">
              <div className="flex items-center gap-3 text-[12.5px]">
                <FileText className="size-5 text-bad" />
                <div>
                  <div className="font-medium text-link">{dofi.file.name}</div>
                  <div className="text-[11px] text-ink-soft">{dofi.file.size} · uploaded by {dofi.submitter}</div>
                </div>
              </div>
              {reviewDone && (
                <motion.div
                  className="mt-3 flex items-center gap-3 text-[12.5px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FileText className="size-5 text-bad" />
                  <div>
                    <div className="font-medium text-link">DOFI_{dofi.number}_summary.pdf</div>
                    <div className="text-[11px] text-ink-soft">Generated automatically at submission</div>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Bekreftelse på Review Submission */}
      <AnimatePresence>
        {beat === "int.review" && reviewClicked && !reviewDone && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-night/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[420px] rounded-lg bg-card p-6 shadow-[var(--shadow-float)]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={spring}
            >
              <div className="text-[16px] font-semibold">Review Submission</div>
              <p className="mt-2 text-[13px] text-ink-weak">
                Approve this DOFI for evaluation? A DOFI number will be allocated and the inventors
                will receive a receipt.
              </p>
              <div className="mt-4 flex justify-end gap-2 text-[13px]">
                <span className="rounded-md border border-hairline px-4 py-2">Send back</span>
                <span className="rounded-md bg-sf-blue px-4 py-2 font-semibold text-white">Approve</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        show={beat === "int.review" && reviewDone}
        title={`DOFI ${dofi.number} is now Under Evaluation`}
        body="Receipt sent to 3 inventors · Project manager notified"
      />
      <Toast
        show={beat === "int.accept" && accepted}
        title="DOFI accepted"
        body="Notification sent to inventors and project manager"
      />

      <EmailOverlay
        show={beat === "int.receipt"}
        to="ingrid.solheim@ous-hf.no, amir.haddad@farmasi.uio.no, marte.lien@ous-hf.no"
        subject={`Receipt of DOFI ${dofi.number} - ${dofi.title}`}
      >
        <p>Dear inventors,</p>
        <p className="mt-2">
          Thank you for submitting your invention disclosure (DOFI) entitled “{dofi.title}”, which
          was received by Inven2 on {dofi.receipt}.
        </p>
        <EmailCallout>
          The DOFI has received DOFI number <strong>{dofi.number}</strong>. Please refer to this
          number in all correspondence with Inven2.
        </EmailCallout>
        <p>
          Your DOFI is now under evaluation. <strong>{inven2.projectManager}</strong> has been
          assigned as project manager and will be your contact person throughout the process. You
          can follow the status and communicate with us directly on Inven2 Connect.
        </p>
        <EmailButton>Open DOFI {dofi.number} on Inven2 Connect</EmailButton>
      </EmailOverlay>
    </div>
  );
}

function QuickAction({
  id,
  primary,
  children,
}: {
  id?: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      id={id}
      layout
      className={cn(
        "script-click-target inline-flex h-8 items-center rounded-md border px-3.5 text-[13px] font-medium",
        primary ? "border-sf-blue bg-sf-blue text-white" : "border-hairline bg-card text-sf-blue",
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={spring}
    >
      {children}
    </motion.span>
  );
}

function Highlight({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-ink-soft">{label}</div>
      <div className="mt-0.5 text-[13px] font-medium">{children ?? value}</div>
    </div>
  );
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="border-b border-hairline pb-1.5">
      <div className="text-[11px] text-ink-soft">{label}</div>
      <motion.div key={value} className={cn("mt-0.5", highlight && "font-semibold text-ok")} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>
        {value}
      </motion.div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-md border border-hairline bg-card p-4 shadow-[var(--shadow-card)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <div className="mb-3 text-[14px] font-semibold">{title}</div>
      {children}
    </motion.div>
  );
}

function ChatterPost({
  initials,
  color,
  name,
  meta,
  delay,
  notified,
  reply,
  children,
}: {
  initials: string;
  color: string;
  name: string;
  meta: string;
  delay: number;
  notified?: boolean;
  reply?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn("flex gap-3", reply && "ml-8")}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
    >
      <Avatar initials={initials} color={color} className="size-8 text-[11px]" />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-semibold text-ink">{name}</span>
          <span className="text-ink-soft">{meta}</span>
        </div>
        <div className="mt-1 rounded-md bg-surface px-3 py-2 text-[12.5px] leading-relaxed">{children}</div>
        {notified && (
          <motion.div
            className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 1.2 }}
          >
            <Mail className="size-3" /> E-mail notification sent to 3 inventors: “New message on {dofi.title} – Inven2 Connect”
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** Teller opp til DOFI-nummeret – «nummeret tildeles». */
function CountUp({ to, animate }: { to: number; animate: boolean }) {
  const [value, setValue] = useState(animate ? to - 40 : to);
  useEffect(() => {
    if (!animate) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = to - 40;
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, animate]);
  return (
    <motion.span
      className="inline-block rounded bg-secondary/15 px-1.5 font-mono font-bold text-teal-dark"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      {value}
    </motion.span>
  );
}

export { UserRound };

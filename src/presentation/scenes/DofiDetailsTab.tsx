import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { dofi } from "../data";
import { reached, type BeatKey } from "../story";
import { TypedValue } from "../Typewriter";
import { FieldBox, FieldLabel, LeaderPicker, RevealText, Section, YesNo } from "./formParts";

const leaderOptions = [
  {
    id: "leader-option-uio",
    name: "Anne Berit Holm",
    role: "Instituttleder, Institutt for klinisk medisin",
    org: "UiO",
  },
  {
    id: "leader-option-ous",
    name: "Hans Petter Aarseth",
    role: "Klinikkleder, Medisinsk klinikk",
    org: "OUS",
  },
  {
    id: "leader-option-ahus",
    name: "Turid Bjørnstad",
    role: "Forskningsdirektør",
    org: "Ahus",
  },
];

export function DofiDetailsTab({
  beat,
  clickedTargets,
  scrollTo,
}: {
  beat: BeatKey;
  clickedTargets: string[];
  scrollTo: (el: HTMLElement | null, block?: ScrollLogicalPosition) => void;
}) {
  const infoRef = useRef<HTMLDivElement>(null);
  const disclosureRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);

  const clicked = (id: string) => clickedTargets.includes(id);

  // Kumulativ tilstand: hva er fylt ut på dette tidspunktet i historien?
  const titleTyping = beat === "dofi.title" && clicked("#field-title");
  const titleDone = reached(beat, "dofi.leader");
  const leaderOpen = beat === "dofi.leader" && clicked("#field-leader") && !clicked("#leader-option-ous");
  const leaderDone = reached(beat, "dofi.disclosure") || clicked("#leader-option-ous");
  const additionalDone = reached(beat, "dofi.description");
  const disclosureYes = reached(beat, "dofi.description") || clicked("#toggle-disclosure-yes");
  const disclosureTyping = beat === "dofi.disclosure" && clicked("#toggle-disclosure-yes");
  const descTyping = beat === "dofi.description";
  const descDone = reached(beat, "dofi.product");
  const productShow = reached(beat, "dofi.product");
  const productAnimating = beat === "dofi.product";
  const fileUploaded = reached(beat, "dofi.toInventors") || clicked("#btn-upload");
  const fileAnimating = beat === "dofi.files";
  const isAccepted = reached(beat, "acc.email");

  useEffect(() => {
    switch (beat) {
      case "dofi.new":
      case "dofi.title":
        scrollTo(infoRef.current, "start");
        break;
      case "dofi.leader":
        scrollTo(infoRef.current, "start");
        break;
      case "dofi.disclosure":
        scrollTo(disclosureRef.current, "center");
        break;
      case "dofi.description":
        scrollTo(descRef.current, "start");
        break;
      case "dofi.product":
        scrollTo(productRef.current, "start");
        break;
      case "dofi.files":
      case "dofi.toInventors":
        scrollTo(filesRef.current, "start");
        break;
    }
  }, [beat, scrollTo]);

  return (
    <div className="space-y-5 pb-[60vh]">
      {/* Information */}
      <Section
        sectionRef={infoRef}
        title="Information"
        hint="Give your invention a short, recognisable name."
      >
        <div>
          <FieldLabel required>Invention title</FieldLabel>
          <FieldBox id="field-title" focused={titleTyping}>
            {titleDone ? (
              dofi.title
            ) : (
              <TypedValue
                text={dofi.title}
                active={titleTyping}
                startDelay={350}
                placeholder="e.g. Method for early detection of…"
              />
            )}
          </FieldBox>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <FieldLabel required>Main Institutional Leader</FieldLabel>
            <LeaderPicker
              id="field-leader"
              open={leaderOpen}
              value={leaderDone ? `${dofi.leader.name} – ${dofi.leader.org}` : null}
              options={leaderOptions}
              selectedOptionId={leaderDone ? "leader-option-ous" : undefined}
            />
          </div>
          <div>
            <FieldLabel>Additional Institutional Leaders</FieldLabel>
            <FieldBox>
              <AnimatePresence>
                {additionalDone ? (
                  <motion.span
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-0.5 text-[12px] font-medium text-teal-dark"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {dofi.additionalLeader.name} – UiO
                  </motion.span>
                ) : (
                  <span className="text-ink-soft/60">Select leaders from other institutions…</span>
                )}
              </AnimatePresence>
            </FieldBox>
          </div>
        </div>

        <div>
          <FieldLabel hint="Persons outside your institution(s) who contributed to the invention.">
            External Contributors
          </FieldLabel>
          <FieldBox>
            <RevealText show={additionalDone} text="None." placeholder="" />
          </FieldBox>
        </div>

        <div className="grid grid-cols-2 gap-5" ref={disclosureRef}>
          <div>
            <FieldLabel required>The DOFI includes software</FieldLabel>
            <YesNo id="toggle-software" value={reached(beat, "dofi.title") ? "no" : null} />
          </div>
          <div>
            <FieldLabel required>Public disclosure planned?</FieldLabel>
            <YesNo
              id="toggle-disclosure"
              yesId="toggle-disclosure-yes"
              value={disclosureYes ? "yes" : null}
            />
          </div>
        </div>

        <AnimatePresence>
          {disclosureYes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-r-md border-l-4 border-primary bg-callout-pink p-4">
                <FieldLabel
                  required
                  hint="When and where do you plan to publish or present? Public disclosure before filing can prevent patent protection."
                >
                  Planned disclosure details
                </FieldLabel>
                <FieldBox multiline>
                  {reached(beat, "dofi.description") ? (
                    dofi.disclosurePlan
                  ) : (
                    <TypedValue text={dofi.disclosurePlan} active={disclosureTyping} startDelay={500} speed={0.6} />
                  )}
                </FieldBox>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Description */}
      <Section
        sectionRef={descRef}
        title="Description of the invention"
        hint="Briefly describe your invention and the research behind it."
      >
        <div>
          <FieldLabel required hint="What have you discovered or developed, and what is the scientific basis?">
            Invention and research results
          </FieldLabel>
          <FieldBox multiline focused={descTyping} className="min-h-[110px]">
            {descDone ? (
              dofi.description
            ) : (
              <TypedValue text={dofi.description} active={descTyping} startDelay={600} speed={0.32} />
            )}
          </FieldBox>
        </div>
      </Section>

      {/* Likely product & unmet need */}
      <Section
        sectionRef={productRef}
        title="Likely product & unmet need"
        hint="Help us understand the path from research result to product."
      >
        {[
          { label: "What is the product?", hint: "What product, service or method could this become?", text: dofi.product },
          {
            label: "What problem is your invention solving?",
            hint: "What unmet need or problem does it address?",
            text: dofi.problem,
          },
          {
            label: "How is the problem solved today?",
            hint: "How is this problem handled today, and what are the limits?",
            text: dofi.today,
          },
          {
            label: "How does your invention solve the problem better?",
            hint: "How does your invention improve on today's solutions?",
            text: dofi.better,
          },
          { label: "Who are the likely customers?", hint: "Who would use or buy this?", text: dofi.customers },
        ].map((f, i) => (
          <div key={f.label}>
            <FieldLabel required hint={f.hint}>
              {f.label}
            </FieldLabel>
            <FieldBox multiline className="min-h-[56px]">
              <RevealText show={productShow} text={f.text} delay={productAnimating ? 0.5 + i * 0.55 : 0} />
            </FieldBox>
          </div>
        ))}
      </Section>

      {/* Existing data */}
      <Section
        title="Existing data & stage of development"
        hint="Summarise supporting data and how far development has reached."
      >
        <div>
          <FieldLabel required>Give a summary of existing data</FieldLabel>
          <FieldBox multiline className="min-h-[72px]">
            <RevealText show={productShow} text={dofi.data} delay={productAnimating ? 3.4 : 0} />
          </FieldBox>
        </div>
      </Section>

      {/* Files */}
      <Section
        sectionRef={filesRef}
        title="Supporting documents"
        hint="Upload manuscripts, data, figures or other documents that support the disclosure."
      >
        <div className="flex items-center gap-4">
          <span
            id="btn-upload"
            className="script-click-target inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-[13px] font-semibold text-primary"
          >
            <Upload className="size-4" /> Upload Files
          </span>
          <span className="text-[12px] text-ink-soft">Or drop files here</span>
        </div>
        <AnimatePresence>
          {fileUploaded && (
            <motion.div
              className="flex items-center gap-3 rounded-md border border-hairline bg-surface px-4 py-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileText className="size-6 text-bad" />
              <div className="flex-1">
                <div className="text-[13px] font-medium text-ink">{dofi.file.name}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                  <motion.div
                    className="h-full bg-secondary"
                    initial={{ width: fileAnimating ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: fileAnimating ? 1.3 : 0, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <span className="text-[11.5px] text-ink-soft">{dofi.file.size}</span>
              <motion.span
                initial={{ opacity: fileAnimating ? 0 : 1, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: fileAnimating ? 1.35 : 0, type: "spring", stiffness: 200, damping: 14 }}
              >
                <CheckCircle2 className="size-5 text-ok" />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {isAccepted && (
        <Section title="Executive Summary" hint="Summarised by Inven2 after evaluation.">
          <FieldBox multiline className="min-h-[72px]">
            Peroralt anabolt legemiddel (ON-114) mot osteoporose med solid preklinisk datapakke og
            tydelig udekket behov. Patentsøknad prioriteres før planlagt publisering (ASBMR 2027).
            Anbefalt: Accept as standard project.
          </FieldBox>
        </Section>
      )}
    </div>
  );
}

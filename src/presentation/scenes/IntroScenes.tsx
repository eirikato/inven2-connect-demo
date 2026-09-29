import { motion } from "motion/react";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  FlaskConical,
  Lightbulb,
  MessageSquareText,
  Route,
  Scale,
  Users,
} from "lucide-react";
import { Inven2Logo, NightBackdrop } from "../chrome";
import type { BeatKey } from "../story";

const spring = { type: "spring", stiffness: 90, damping: 18 } as const;

export function TitleScene() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <NightBackdrop />
      <div className="relative z-10 flex flex-col items-center px-10 text-center">
        <motion.div
          className="mb-8 flex items-center gap-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          {[Lightbulb, FlaskConical, Route].map((Icon, i) => (
            <motion.span
              key={i}
              className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/85 backdrop-blur-sm"
              animate={{ y: [0, -6, 0], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <Icon className="size-6" />
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="mb-4 text-[12px] font-semibold tracking-[0.3em] text-secondary uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          From Science to Business™
        </motion.div>
        <motion.h1
          className="text-6xl font-medium text-white xl:text-7xl"
          initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...spring, delay: 0.25 }}
        >
          Inven2 Connect
        </motion.h1>
        <motion.p
          className="mt-5 max-w-2xl text-lg text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.65 }}
        >
          Fra idé til akseptert DOFI – én plattform for innmelding, oppfølging og dialog om nye
          oppfinnelser
        </motion.p>

        <motion.div
          className="absolute -bottom-28 left-1/2 -translate-x-1/2 text-sm tracking-wide text-white/55"
          animate={{ opacity: [0.35, 0.95, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Trykk for å starte →
        </motion.div>
      </div>
    </div>
  );
}

const forResearchers = [
  {
    icon: ClipboardList,
    title: "Ett skjema, med veiledning",
    body: "Strukturerte spørsmål og hint erstatter Word-maler og løse e-poster.",
  },
  {
    icon: Users,
    title: "Teamet samlet",
    body: "Medoppfinnere inviteres, registrerer seg og bidrar i samme utkast.",
  },
  {
    icon: Route,
    title: "Sporbar status",
    body: "Draft → Submitted → Under Evaluation → Accepted – alltid synlig i «My DOFIs».",
  },
  {
    icon: MessageSquareText,
    title: "Dialog på saken",
    body: "Spørsmål og svar ligger på DOFIen – med e-postvarsel når noe skjer.",
  },
];

const forInven2 = [
  {
    icon: FileText,
    title: "Komplett grunnlag fra dag én",
    body: "Alle obligatoriske felt, dokumenter og oppfinnere er på plass før innsending.",
  },
  {
    icon: Scale,
    title: "Eierskap og nummer automatisk",
    body: "Ansettelser gir institusjonelt eierskap; DOFI-nummer og PDF genereres uten manuelle steg.",
  },
  {
    icon: CheckCircle2,
    title: "Kø og beslutning i Salesforce",
    body: "Review, evaluering og aksept skjer med ett klikk – og logges på saken.",
  },
];

export function OutroScene({ beat }: { beat: BeatKey }) {
  const thanks = beat === "outro.thanks";
  return (
    <div className="relative flex size-full items-center justify-center">
      <NightBackdrop />
      {!thanks ? (
        <div className="relative z-10 w-full max-w-[1180px] px-12">
          <motion.div
            className="text-[12px] font-semibold tracking-[0.3em] text-secondary uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Oppsummering
          </motion.div>
          <motion.h2
            className="mt-2 text-5xl font-medium text-white"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Hva Inven2 Connect gir
          </motion.h2>

          <div className="mt-10 grid grid-cols-[1fr_1px_1fr] gap-10">
            <div>
              <h3 className="mb-4 text-[13px] font-semibold tracking-[0.18em] text-white/60 uppercase">
                For forskere
              </h3>
              <div className="space-y-3">
                {forResearchers.map((item, i) => (
                  <SummaryCard key={item.title} {...item} delay={0.25 + i * 0.12} tone="primary" />
                ))}
              </div>
            </div>
            <div className="bg-white/15" />
            <div>
              <h3 className="mb-4 text-[13px] font-semibold tracking-[0.18em] text-white/60 uppercase">
                For Inven2
              </h3>
              <div className="space-y-3">
                {forInven2.map((item, i) => (
                  <SummaryCard key={item.title} {...item} delay={0.4 + i * 0.12} tone="secondary" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h1
            className="text-7xl font-semibold tracking-tight text-white xl:text-8xl"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...spring, delay: 0.15 }}
          >
            TAKK!
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-xl text-white/72"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.55 }}
          >
            Har du en idé? Meld den inn på Inven2 Connect – vi tar det derfra, sammen.
          </motion.p>
          <motion.div
            className="mt-20 rounded-full px-6 py-3"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              boxShadow: [
                "0 0 0px rgb(0 181 221 / 0%)",
                "0 0 46px rgb(0 181 221 / 30%)",
                "0 0 0px rgb(0 181 221 / 0%)",
              ],
            }}
            transition={{
              opacity: { delay: 0.9, duration: 0.8 },
              boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
            }}
          >
            <Inven2Logo tone="light" className="w-[178px]" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  body,
  delay,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  delay: number;
  tone: "primary" | "secondary";
}) {
  return (
    <motion.div
      className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring, delay }}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
          tone === "primary" ? "bg-primary/25 text-[#ff9ac4]" : "bg-secondary/25 text-secondary"
        }`}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <div className="text-[15px] font-semibold text-white">{title}</div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-white/65">{body}</div>
      </div>
    </motion.div>
  );
}

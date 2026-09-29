import { AnimatePresence, motion } from "motion/react";
import { Bell, Lock, Menu, Paperclip, RotateCw, Search, UserRound, X } from "lucide-react";
import { assetUrl, cn } from "@/lib/utils";
import type { Stage } from "./data";

const spring = { type: "spring", stiffness: 110, damping: 18 } as const;

export function Inven2Logo({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "light";
}) {
  return (
    <img
      src={assetUrl(tone === "brand" ? "/media/logo-inven2-mork.png" : "/media/logo-inven2-hvit.png")}
      alt="Inven2"
      className={cn("block h-auto select-none object-contain", className)}
    />
  );
}

/** Nettleserramme rundt portalsidene. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex size-full flex-col bg-night", className)}>
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-surface-2 px-4 py-2">
        <div className="flex gap-1.5">
          {["bg-bad/70", "bg-warn/70", "bg-ok/70"].map((c) => (
            <span key={c} className={`size-[10px] rounded-full ${c}`} />
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-[12px] text-ink/80">
          <Lock className="size-3 text-ok" />
          <span className="font-mono">{url}</span>
        </div>
        <RotateCw className="size-3.5 text-ink/40" />
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col bg-card">{children}</div>
    </div>
  );
}

export const CONNECT_NAV = [
  { key: "home", label: "Home" },
  { key: "mydofis", label: "My DOFIs" },
  { key: "create", label: "Create New DOFI" },
  { key: "details", label: "Update Your Details" },
  { key: "about", label: "About Inven2 Connect" },
] as const;
export type ConnectNavKey = (typeof CONNECT_NAV)[number]["key"];

/** Toppen av Inven2 Connect: hvit header, logo, meny, søk, varsler, profil. */
export function ConnectHeader({
  active,
  loggedIn = true,
}: {
  active: ConnectNavKey;
  loggedIn?: boolean;
}) {
  return (
    <motion.header
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="relative z-20 shrink-0 border-b border-hairline bg-card"
    >
      <div className="mx-auto flex h-[64px] max-w-[1400px] items-center gap-6 px-8">
        <Menu className="size-5 text-ink/70" />
        <img
          src={assetUrl("/media/inven2-header-logo.png")}
          alt="Inven2"
          className="h-[30px] select-none"
        />
        <nav className="ml-6 flex items-center gap-7 text-[13px]">
          {CONNECT_NAV.map((item) => (
            <span
              key={item.key}
              data-nav={item.key}
              className={cn(
                "relative py-5 text-ink/80",
                item.key === active && "font-semibold text-ink",
              )}
            >
              {item.label}
              {item.key === active && (
                <motion.span
                  layoutId="connect-nav-active"
                  className="absolute inset-x-0 bottom-3 h-[2px] bg-primary"
                />
              )}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5 text-ink/70">
          <Search className="size-[18px]" />
          {loggedIn ? (
            <>
              <span className="relative">
                <Bell className="size-[18px]" />
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                IS
              </span>
            </>
          ) : (
            <span className="rounded-[4px] border border-ink/20 px-3 py-1.5 text-[12px] text-ink/80">
              Log in
            </span>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export function ConnectFooter({ delay = 0 }: { delay?: number }) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="mt-auto shrink-0 bg-footer-grey py-5 text-center text-[12px] text-white"
    >
      Inven2 AS, Gaustadalléen 21, 0349 Oslo. Copyright © 2026. All Rights Reserved.
    </motion.footer>
  );
}

/** Statusmerke for DOFI Stage – farger som i Lightning/Connect. */
export function StageBadge({ stage, className }: { stage: Stage; className?: string }) {
  const tone: Record<Stage, string> = {
    Draft: "bg-surface-3 text-ink-weak",
    Submitted: "bg-secondary/15 text-teal-dark",
    "Under Evaluation": "bg-warn/15 text-warn",
    Accepted: "bg-ok/15 text-ok",
    Declined: "bg-bad/15 text-bad",
  };
  return (
    <motion.span
      key={stage}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tone[stage],
        className,
      )}
    >
      {stage}
    </motion.span>
  );
}

/** Mørk bakgrunn for tittel og avslutning – Connect-fargene i myke gradienter. */
export function NightBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden night-surface">
      <motion.img
        src={assetUrl("/media/backdrop-tech.jpg")}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-30 mix-blend-luminosity"
        initial={{ scale: 1.035, x: 0 }}
        animate={{ scale: [1.035, 1.075, 1.035], x: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-40 -right-40 size-[620px] rounded-full bg-secondary/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-52 -left-32 size-[560px] rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

/** E-postvisning som legger seg over siden – Inven2-merket mal. */
export function EmailOverlay({
  show,
  to,
  subject,
  attachment,
  children,
}: {
  show: boolean;
  to: string;
  subject: string;
  attachment?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-night/45 p-8 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-[640px] max-w-full overflow-hidden rounded-xl bg-card shadow-[var(--shadow-float)]"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={spring}
          >
            {/* E-postklient-hode */}
            <div className="border-b border-hairline bg-surface-2 px-5 py-3 text-[12px] text-ink-weak">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">{subject}</span>
                <X className="size-4 text-ink/40" />
              </div>
              <div className="mt-1 flex gap-4">
                <span>
                  <span className="text-ink-soft">From:</span> Inven2 Connect &lt;connect@inven2.com&gt;
                </span>
                <span>
                  <span className="text-ink-soft">To:</span> {to}
                </span>
              </div>
              {attachment && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded border border-hairline bg-card px-2 py-0.5 text-[11px] text-ink">
                  <Paperclip className="size-3 text-link" /> {attachment}
                </div>
              )}
            </div>
            {/* Inven2-mal */}
            <div className="border-t-[6px] border-link">
              <div className="flex items-center justify-between px-8 py-4">
                <img
                  src={assetUrl("/media/inven2-header-logo.png")}
                  alt="Inven2"
                  className="h-[30px]"
                />
                <span className="text-[11px] tracking-wide text-ink-soft">Inven2 Connect</span>
              </div>
              <div className="px-8 pb-6 text-[13px] leading-relaxed text-ink">{children}</div>
              <div className="bg-footer px-8 py-4 text-center text-[11.5px] text-white">
                <div className="font-semibold tracking-wide">From Science to Business™</div>
                <div className="mt-1 opacity-90">post@inven2.com · inven2.com</div>
              </div>
              <div className="bg-[#DDE4E9] px-8 py-2.5 text-center text-[10px] text-ink-weak">
                Copyright © 2026 Inven2 AS · Gaustadalléen 21, 0349 Oslo
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmailButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-3 inline-block rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white">
      {children}
    </span>
  );
}

export function EmailCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 rounded-r-md border-l-4 border-link bg-callout px-4 py-3 text-[12.5px]">
      {children}
    </div>
  );
}

/** Liten toast nederst til høyre, som i Lightning. */
export function Toast({ show, title, body }: { show: boolean; title: string; body?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-20 left-1/2 z-40 flex -translate-x-1/2 items-start gap-3 rounded-md bg-ok px-5 py-3 text-white shadow-[var(--shadow-float)]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={spring}
        >
          <div>
            <div className="text-[13px] font-semibold">{title}</div>
            {body && <div className="text-[12px] opacity-90">{body}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Avatar({
  initials,
  color,
  className,
}: {
  initials: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white",
        color,
        className,
      )}
    >
      {initials}
    </span>
  );
}

export { UserRound };

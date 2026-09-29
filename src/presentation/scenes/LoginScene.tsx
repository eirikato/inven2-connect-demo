import { motion } from "motion/react";
import { BrowserFrame } from "../chrome";
import { Caret, useTypewriter } from "../Typewriter";
import { dofi } from "../data";
import { assetUrl } from "@/lib/utils";
import type { BeatKey } from "../story";

const spring = { type: "spring", stiffness: 100, damping: 18 } as const;

export function LoginScene({ beat }: { beat: BeatKey }) {
  const typing = beat === "login.typing";
  const email = useTypewriter(dofi.submitterEmail, typing, 700, 0.9);

  return (
    <BrowserFrame url="https://inven2.my.site.com/connect/s/login">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-2">
        <motion.img
          src={assetUrl("/media/connect-banner.jpg")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: [1.04, 1.09, 1.04], opacity: 1 }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <div className="absolute inset-0 bg-hero/55" />

        <motion.div
          className="relative z-10 w-[440px] rounded-xl bg-card p-10 shadow-[var(--shadow-float)]"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          <img
            src={assetUrl("/media/inven2-header-logo.png")}
            alt="Inven2"
            className="mx-auto h-[40px]"
          />
          <div className="mt-2 text-center text-[12px] tracking-[0.2em] text-ink-soft uppercase">
            Inven2 Connect
          </div>

          <label className="mt-8 block text-[12px] font-medium text-ink-weak">Username</label>
          <div
            id="login-email"
            className="mt-1 flex h-11 items-center rounded-md border border-hairline bg-surface px-3 text-[14px] text-ink"
          >
            {email.shown}
            {typing && !email.done && <Caret />}
          </div>

          <label className="mt-4 block text-[12px] font-medium text-ink-weak">Password</label>
          <div
            id="login-password"
            className="mt-1 flex h-11 items-center rounded-md border border-hairline bg-surface px-3 text-[14px] text-ink"
          >
            {email.done && (
              <motion.span
                className="tracking-[0.3em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                ••••••••••••
              </motion.span>
            )}
          </div>

          <div
            id="login-submit"
            className="script-click-target mt-6 flex h-11 items-center justify-center rounded-md bg-primary text-[14px] font-semibold text-white"
          >
            Log in
          </div>

          <div className="mt-5 flex justify-between text-[12px] text-link">
            <span>Forgot your password?</span>
            <span>Not a member? Sign up</span>
          </div>
        </motion.div>
      </div>
    </BrowserFrame>
  );
}

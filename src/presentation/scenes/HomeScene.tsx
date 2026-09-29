import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { BrowserFrame, ConnectFooter, ConnectHeader } from "../chrome";
import { reached, type BeatKey } from "../story";
import { assetUrl } from "@/lib/utils";

const spring = { type: "spring", stiffness: 95, damping: 19 } as const;

const cards = [
  {
    title: "Inven2 Marketplace",
    body: "You are welcome to explore existing licensing opportunities through Inven2 Marketplace.",
    cta: "Open Inven2 Marketplace",
    image: "/media/card-marketplace.png",
  },
  {
    title: "News & Events",
    body: "Follow us on LinkedIn to stay up to date on the latest news and upcoming events.",
    cta: "Connect on LinkedIn",
    image: "/media/card-linkedin.png",
  },
  {
    title: "Contact Us",
    body: "Please feel free to reach out! You can find our contact information on our website.",
    cta: "Reach out to a team member",
    image: "/media/card-team.jpg",
  },
];

export function HomeScene({ beat }: { beat: BeatKey }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (beat === "home.in") {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else if (beat === "home.cards") {
      const t = window.setTimeout(
        () => cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        250,
      );
      return () => window.clearTimeout(t);
    } else if (beat === "home.submit") {
      const t = window.setTimeout(
        () => submitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        150,
      );
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [beat]);

  const showCards = reached(beat, "home.cards");

  return (
    <BrowserFrame url="https://inven2.my.site.com/connect/s/">
      <ConnectHeader active="home" loggedIn={false} />
      <div ref={scrollRef} className="scroll-slim flex flex-1 flex-col overflow-y-auto">
        {/* Hero */}
        <motion.div
          className="relative shrink-0 overflow-hidden bg-hero shadow-[0_8px_4px_rgba(0,0,0,0.18)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <motion.img
            src={assetUrl("/media/connect-banner.jpg")}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover opacity-25 mix-blend-multiply"
            initial={{ scale: 1.04 }}
            animate={{ scale: [1.04, 1.09, 1.04] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative mx-auto max-w-[1400px] px-8 py-14 text-center text-white">
            <motion.h1
              className="text-[2.6rem] font-light"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.25 }}
            >
              From Science to Business™
            </motion.h1>
            <motion.p
              className="mt-3 text-[1.25rem] italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.4 }}
            >
              Inven2 supports research-based innovation and commercialization.
            </motion.p>
            <motion.span
              className="mt-7 inline-block rounded-md bg-primary px-9 py-3.5 text-[1.1rem] font-semibold shadow-md"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.6 }}
            >
              Submit a new DOFI
            </motion.span>
          </div>
        </motion.div>

        {/* Infokort */}
        <div ref={cardsRef} className="mx-auto w-full max-w-[1200px] px-8 pt-12">
          <div className="grid grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                className="flex flex-col overflow-hidden rounded-lg border-2 border-secondary/60 bg-card shadow-[var(--shadow-card)]"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.7 + i * 0.14 }}
              >
                <img
                  src={assetUrl(card.image)}
                  alt=""
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[19px] font-semibold text-primary">{card.title}</h3>
                  <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-weak">
                    {card.body}
                  </p>
                  <span className="mt-4 text-[12.5px] font-semibold text-secondary">
                    {card.cta} →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <hr className="mx-auto mt-12 w-[90%] border-[#E0DDD8]" />
        </div>

        {/* Submit DOFI */}
        <div ref={submitRef} className="mx-auto w-full max-w-[1200px] px-8 py-12">
          <motion.div
            className="grid grid-cols-[440px_1fr] items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showCards ? 1 : 0.85, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            <img src={assetUrl("/media/dofi-arrows.png")} alt="DOFI process" className="w-full" />
            <div>
              <h2 className="text-[30px] font-semibold text-primary">Submit DOFI</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-weak">
                An invention disclosure (DOFI) is the first step towards commercializing
                research-based inventions.
                <br />
                Click on the button below to start filling out our DOFI submission form. This
                procedure requires login.
              </p>
              <p className="mt-3 text-[13px] text-ink-soft">
                Please let us know if you need our assistance at any stage of the process.
              </p>
              <span
                id="home-create-dofi"
                className="script-click-target mt-6 inline-block rounded-md bg-primary px-8 py-3 text-[15px] font-semibold text-white shadow-md"
              >
                Create a new DOFI
              </span>
            </div>
          </motion.div>
        </div>

        {/* Kontakt */}
        <div className="bg-hero py-10 text-white">
          <div className="mx-auto max-w-[900px] px-8">
            <h2 className="text-[26px] font-semibold">Contact Inven2</h2>
            <p className="mt-2 text-[13.5px] opacity-95">
              Have a question or need help getting started? Send us a message and the Inven2 team
              will get back to you.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {["Your name", "Your email"].map((p) => (
                <div key={p} className="rounded-md bg-white/95 px-3 py-2.5 text-[13px] text-ink-soft">
                  {p}
                </div>
              ))}
              <div className="col-span-2 h-20 rounded-md bg-white/95 px-3 py-2.5 text-[13px] text-ink-soft">
                Your message
              </div>
            </div>
            <span className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-[13px] font-semibold">
              Send message
            </span>
          </div>
        </div>
        <ConnectFooter />
      </div>
    </BrowserFrame>
  );
}

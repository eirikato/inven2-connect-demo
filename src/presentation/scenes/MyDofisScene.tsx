import { motion } from "motion/react";
import { ArrowUpDown, LayoutList, Search } from "lucide-react";
import { BrowserFrame, ConnectFooter, ConnectHeader, StageBadge } from "../chrome";
import { myDofis, type Stage } from "../data";
import type { BeatKey } from "../story";

const spring = { type: "spring", stiffness: 110, damping: 18 } as const;

export function MyDofisScene({ beat: _beat }: { beat: BeatKey }) {
  return (
    <BrowserFrame url="https://inven2.my.site.com/connect/s/my-dofis">
      <ConnectHeader active="mydofis" />
      <div className="scroll-slim flex flex-1 flex-col overflow-y-auto bg-sf-bg">
        <div className="mx-auto w-full max-w-[1100px] px-8 pt-8">
          <motion.h1
            className="text-[28px] font-light text-ink"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            Welcome to Inven2 Connect, Ingrid!
          </motion.h1>

          <motion.div
            className="card-elevated mt-6 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-white">
                <LayoutList className="size-5" />
              </span>
              <div>
                <div className="text-[16px] font-semibold text-ink">My DOFIs</div>
                <div className="text-[12px] text-ink-soft">{myDofis.length} items · Sorted by DOFI Id</div>
              </div>
              <div className="ml-auto flex w-[260px] items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-2 text-[12.5px] text-ink-soft">
                <Search className="size-4" /> Search this list...
              </div>
            </div>
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface-2 text-[11.5px] font-semibold tracking-wide text-ink-weak uppercase">
                <tr>
                  {["DOFI Id", "DOFI Name", "Invention Title", "Created By", "DOFI Stage", "My Role"].map((h) => (
                    <th key={h} className="px-5 py-2.5">
                      <span className="inline-flex items-center gap-1">
                        {h} <ArrowUpDown className="size-3 opacity-50" />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {myDofis.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    className={i === 0 ? "bg-mint/25" : "bg-card"}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.35 + i * 0.14 }}
                  >
                    <td className="px-5 py-3.5 font-medium text-link">{row.id}</td>
                    <td className="px-5 py-3.5 text-ink-weak">{row.stage === "Draft" ? "—" : row.id.replace("I2-", "DOFI ")}</td>
                    <td className="px-5 py-3.5 font-medium text-ink">{row.name}</td>
                    <td className="px-5 py-3.5 text-ink-weak">{row.createdBy}</td>
                    <td className="px-5 py-3.5">
                      <StageBadge stage={row.stage as Stage} />
                    </td>
                    <td className="px-5 py-3.5 text-ink-weak">{row.role}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            className="mt-4 text-[12.5px] text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            You see every DOFI where you are creator or co-inventor. Click a DOFI Id to open it.
          </motion.p>
        </div>
        <ConnectFooter delay={0.8} />
      </div>
    </BrowserFrame>
  );
}

"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const steps = [
  "Health certificate checked against the load",
  "CHED-P raised in TRACES NT",
  "Pre-notification submitted before arrival",
  "Veterinary checks coordinated at the BCP",
  "Customs declaration aligned with the CHED",
];

/** Signature hero element: the logo is a checklist, so the hero shows a real POAO clearance checklist. */
export function ClearanceChecklist() {
  const reduce = useReducedMotion();
  const tick = (i: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { delay: 0.5 + i * 0.4, duration: 0.35, ease: "easeOut" as const },
        };

  return (
    <aside aria-labelledby="checklist-title" className="rounded-brand border border-salt/14 border-l-4 border-l-cargo bg-overnight/72 p-5 sm:p-6.5">
      <h2 id="checklist-title" className="text-[1.35rem] tracking-wide text-salt">
        A POAO consignment into Ireland
      </h2>
      <p className="mt-1 mb-4 text-[0.88rem] text-starlight">What we handle before your goods are released</p>
      <ol>
        {steps.map((step, i) => (
          <li key={step} className="grid grid-cols-[1.75rem_1fr] items-start gap-3 border-t border-salt/8 py-2.5 text-[0.95rem] text-[#e4ecef]">
            <span className="mt-px grid size-6 place-items-center rounded-[3px] border-2 border-haul" aria-hidden>
              <svg viewBox="0 0 24 24" className="size-[18px] text-cargo" fill="none">
                <motion.path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...tick(i)} />
              </svg>
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <motion.p
        className="mt-3.5 flex items-center gap-2.5 text-[0.95rem] font-bold text-cargo"
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 2.6, duration: 0.4 }}
      >
        <Check aria-hidden className="size-5" strokeWidth={3} />
        Cleared for free circulation
      </motion.p>
    </aside>
  );
}

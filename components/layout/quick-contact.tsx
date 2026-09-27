"use client";

import * as Popover from "@radix-ui/react-popover";
import { ArrowRight, Clock, Mail, MapPin, MessageSquareText, Phone, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const actions = [
  { kind: "link", href: "/contact#enquiry", icon: ArrowRight, title: "Get an Enquiry", text: "Tell us about your shipment", primary: true },
  { kind: "tel", href: site.phone.href, icon: Phone, title: "Call Us", text: site.phone.display },
  { kind: "mail", href: `mailto:${site.email}`, icon: Mail, title: "Email Us", text: site.email },
  { kind: "link", href: "/contact", icon: MapPin, title: "Contact Us", text: "Offices and contact details" },
] as const;

/** Floating quick-contact launcher. Uses only verified contact details from lib/site.ts. */
export function QuickContact() {
  const [open, setOpen] = useState(false);
  const [obscuring, setObscuring] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Never cover a button, link or form field: if something interactive sits under the launcher,
  // fade it out of the way (and let clicks pass through) until the page scrolls to clear space.
  useEffect(() => {
    let frame = 0;
    const INTERACTIVE = "a, button, input, select, textarea, summary, label, [role=button]";
    const check = () => {
      frame = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      // Keyboard users: a focused launcher is always shown.
      if (wrap.contains(document.activeElement)) {
        setObscuring(false);
        return;
      }
      const r = wrap.getBoundingClientRect();
      // Sample a 3x3 grid over the launcher plus a small margin, so partial overlaps are caught too.
      const pad = 6;
      const xs = [r.left - pad, r.left + r.width / 2, r.right + pad - 1];
      const ys = [r.top - pad, r.top + r.height / 2, r.bottom + pad - 1];
      const points: [number, number][] = xs.flatMap((x) => ys.map((y): [number, number] => [x, Math.min(y, window.innerHeight - 1)]));
      const hit = points.some(([x, y]) =>
        document
          .elementsFromPoint(Math.max(0, x), Math.max(0, y))
          .some((el) => !wrap.contains(el) && !el.closest("[data-radix-popper-content-wrapper]") && el.closest(INTERACTIVE)),
      );
      setObscuring(hit);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state", "open", "class"] });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const hidden = obscuring && !open;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <motion.div
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-6"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: reduce ? 0 : 1.2, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div
          ref={wrapRef}
          data-obscuring={hidden ? "true" : undefined}
          className="quick-contact transition-[opacity,translate] duration-200 data-[obscuring=true]:pointer-events-none data-[obscuring=true]:translate-y-3 data-[obscuring=true]:opacity-0"
        >
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label={open ? "Close quick contact options" : "Quick contact options"}
              className="group grid size-14 place-items-center rounded-full bg-ship text-cargo shadow-[0_10px_28px_-8px_rgb(0_3_21/0.55)] ring-2 ring-cargo/70 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-atlantic data-[state=open]:bg-overnight"
            >
              {open ? (
                <X aria-hidden className="size-6" />
              ) : (
                <MessageSquareText aria-hidden className="size-6 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>
          </Popover.Trigger>
        </div>
      </motion.div>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={12}
          collisionPadding={12}
          aria-label="Quick contact options"
          className="z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-brand border border-salt/10 bg-overnight text-salt shadow-[0_24px_60px_-16px_rgb(0_3_21/0.7)] data-[state=open]:animate-menu-in"
        >
          <div className="bg-clearance px-5 pt-4.5 pb-4">
            <p className="font-display text-[1.45rem] leading-tight">How can we help?</p>
            <p className="mt-1 text-[0.88rem] text-starlight">Speak to our customs team directly.</p>
          </div>
          <ul className="p-2">
            {actions.map((a) => {
              const Icon = a.icon;
              const body = (
                <>
                  <span
                    className={
                      "grid size-10 shrink-0 place-items-center rounded-brand " +
                      ("primary" in a && a.primary ? "bg-cargo text-overnight" : "bg-salt/8 text-cargo")
                    }
                  >
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{a.title}</span>
                    <span className="block truncate text-[0.85rem] text-starlight">{a.text}</span>
                  </span>
                </>
              );
              const cls = "flex min-h-14 items-center gap-3.5 rounded-brand px-3 py-2.5 transition-colors hover:bg-salt/6 focus-visible:bg-salt/6";
              return (
                <li key={a.title}>
                  {a.kind === "link" ? (
                    <Link href={a.href} className={cls} onClick={() => setOpen(false)}>
                      {body}
                    </Link>
                  ) : (
                    <a href={a.href} className={cls} onClick={() => setOpen(false)}>
                      {body}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="flex items-start gap-2.5 border-t border-salt/8 px-5 py-3.5 text-[0.82rem] text-starlight">
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-cargo" />
            <span>
              {site.hours.map((h) => (
                <span key={h.short} className="block">
                  {h.days}: {h.time}
                </span>
              ))}
            </span>
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

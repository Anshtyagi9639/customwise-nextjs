import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/content/images";
import { site } from "@/lib/site";
import { RouteLines } from "@/components/layout/route-lines";
import { ClearanceChecklist } from "./clearance-checklist";

export function Hero() {
  return (
    <section aria-labelledby="home-title" className="relative overflow-hidden bg-overnight pt-[calc(var(--nav-h)+2.5rem)] pb-14 text-salt sm:pt-[calc(var(--nav-h)+4.5rem)] sm:pb-22">
      <Image src={images.hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden className="bg-clearance absolute inset-0 opacity-90" />
      <RouteLines />
      <div className="container-site relative grid items-center gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:gap-14">
        <div>
          <h1 id="home-title" className="text-[clamp(2.5rem,5.6vw,4.6rem)] leading-none tracking-[0.01em] text-salt uppercase">
            Customs clearance for the UK &amp; Ireland
            <span className="mt-1 block font-light text-cargo">Specialists in food customs</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-[1.13rem] text-[#d7e3e8]">
            Import, export and transit declarations at any port in the UK and Ireland, with a dedicated team for products of animal origin, fish
            and fresh produce. Independent, and backed by 30 years in customs compliance.
          </p>
          <div className="mt-7 flex flex-wrap gap-3.5">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/contact#enquiry">
                Make an enquiry <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/food-customs">Explore food customs</Link>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] text-[#bfd0d7]">
            <li className="inline-flex items-center gap-2">
              <Phone aria-hidden className="size-4 text-cargo" />
              <a href={site.phone.href} className="underline underline-offset-3 hover:text-cargo">
                {site.phone.display}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock aria-hidden className="size-4 text-cargo" />
              Open 7 days a week
            </li>
          </ul>
        </div>
        <ClearanceChecklist />
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";

import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { MyDatePicker } from "@/components/ui/MyDatePicker";
import { cn } from "@/lib/utils";

import { BentoCard, BentoGrid } from "@/registry/magicui/bento-grid";
import { Marquee } from "@/registry/magicui/marquee";
import { AnimatedBeam as AnimatedBeamMultipleOutputDemo } from "@/registry/magicui/animated-beam";
import { AnimatedList as AnimatedListDemo } from "@/registry/magicui/animated-list";
import { AuroraText } from "@/registry/magicui/aurora-text";
import Iphone15Pro from "@/registry/magicui/iphone-15-pro";
import HeroSection from "@/components/ui/Herosection";
import { RainbowButton } from "@/registry/magicui/rainbow-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Particles } from "@/components/magicui/particles";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/ui/Navbar";

// Example files array
const files = [
  {
    name: "Sorterer etter butikker",
    body: "Du kan enkelt se hva du skal handle i hver enkelt butikk",
  },
  {
    name: "Se butikker nær deg",
    body: "Kartfunksjon som viser butikker nær deg",
  },
  {
    name: "Berenger penger og CO2 spart",
    body: "Med en enkelt klikk beregnes hvor mye penger du har spart samt CO2 spart avhengig om du husket pose eller ikke",
  },
  
];

export default function Home() {
  // Create refs for AnimatedBeam
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  
      
  const features = [
    {
      Icon: CalendarIcon,
      name: "Ukens tilbud",
      description: "Hold deg oppdatert på de aller ferskeste og rimeligste ukestilbudene",
      className: "col-span-3 lg:col-span-1 relative", // make sure to set relative here
      href: "#",
      cta: "Se mer",
      style: { backgroundColor: "#f3f4f8" },
      background: (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="origin-center"
            style={{ transform: "scale(0.7)", filter: "blur(0.5px)" }} // adjust the blur amount as needed
          >
            <MyDatePicker />
          </div>
        </div>
      ),
    },
    {
      Icon: BellIcon,
      name: "Penger og CO2 Spart!",
      description: "Se hvor mye penger og CO₂ du sparer basert på hva du kjøper og om du husker egen pose",
      href: "#",
      cta: "Se mer",
      className: "col-span-3 lg:col-span-2 relative",
      style: { backgroundColor: "#f3f4f8" },
      background: (
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/spart.jpeg"
            alt="Description of the image"
            className="object-cover"
            style={{ width: "550px", height: "200px" }}
          />
        </div>
      ),
    },
    {
      Icon: Share2Icon,
      name: "Personlige oppskrifter",
      description: "Få skreddersydde oppskrifter for deg",
      href: "#",
      cta: "Se mer",
      className: "col-span-3 lg:col-span-2",
      style: { backgroundColor: "#f3f4f8" },
      // Provide the required refs for AnimatedBeam
      background: (
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/rec.jpeg"
            alt="Description of the image"
            className="object-cover"
            style={{ width: "600px", height: "200px", filter: "blur(0.5px)" }}
            
          />
        </div>
      ),
    },
    {
      Icon: FileTextIcon,
      name: "Handleliste",
      description: "Lag handleliste med de billigste produktene per butikk",
      href: "#",
      cta: "Se mer",
      className: "col-span-3 lg:col-span-1",
      style: { backgroundColor: "#f3f4f8" },
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white ">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
  ];

  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
 
  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <main className="mx-auto ml-20 mr-20 mt-20 mb-20">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <Navbar />
      <div className="pt-20">
      <HeroSection/>
      <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
    </div>
    </main>
  );
}





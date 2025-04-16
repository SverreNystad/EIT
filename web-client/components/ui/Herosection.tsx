"use client"
import { AuroraText } from "@/registry/magicui/aurora-text";
import { motion } from "framer-motion";
import Iphone15Pro from "@/registry/magicui/iphone-15-pro";
import { Applegoogle } from "./Applegoogle";

export default function HeroSection() {
  return (
    <section className="flex mb-20 flex-col-reverse items-center justify-between gap-8 md:flex-row">
      {/* Venstre side: Tekst */}
      <div className="flex-1">
        <h1 className="text-7xl font-bold">
          Finn dine <AuroraText className="text-7xl">tilbud</AuroraText>
        </h1>
        
        <p className="mt-4 text-2xl text-gray-700 mb-6">
          Oppdag de beste tilbudene i dag!
        </p>
        
        <Applegoogle />
      </div>

      {/* Høyre side: iPhone-bilde */}
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Iphone15Pro 
          className="size-150 z-1"
          src="/app.png" 
        />
      </motion.div>
    </section>
  );
}

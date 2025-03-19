"use client"
import { AuroraText } from "@/registry/magicui/aurora-text";
import { motion } from "framer-motion";
import iPhoneImage from "@/assets/iphone.png"; // Ensure you have the correct path to your image
import Iphone15Pro from "@/registry/magicui/iphone-15-pro";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { RainbowButton } from "@/registry/magicui/rainbow-button";
import { ShimmerButton } from "../magicui/shimmer-button";

export default function HeroSection() {
  return (
    <section className="flex mb-20 flex-col-reverse items-center justify-between gap-8 md:flex-row">
      {/* Left Side: Text */}
      <div className="flex-1">
        <h1 className="text-7xl font-bold">
          Finn dine <AuroraText className="text-7xl">tilbud</AuroraText>
        </h1>
          <p className="mt-4 text-2xl text-gray-700">Oppdag de beste tilbudene i dag!</p>
            
            <ShimmerButton className="mt-4">Last ned gratis</ShimmerButton>
      </div>

      {/* Right Side: iPhone Image */}
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Iphone15Pro 
            className="size-150 z-1"
            src="/app.png"  // Replace with the correct image path
                        // Adjust width as desired
         />
      </motion.div>
    </section>
  );
}
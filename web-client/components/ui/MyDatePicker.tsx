"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function MyDatePicker() {
  

  return (
    <DayPicker
      animate
      mode="single"
      
    />
  );
}

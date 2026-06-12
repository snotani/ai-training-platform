"use client";

import * as React from "react";
import { TelescopeIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Expand({
  title = "Go deeper",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion className="not-prose my-6 overflow-hidden rounded-xl border bg-muted/30 px-4">
      <AccordionItem value="expand" className="border-b-0">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2 font-medium">
            <TelescopeIcon className="size-4 text-primary" />
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="lesson-rich text-[0.92rem] leading-relaxed text-foreground/90">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

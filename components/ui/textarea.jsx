import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-white px-2.5 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground caret-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-white/10 dark:bg-[#0b1425] dark:text-white dark:placeholder:text-slate-400 dark:caret-blue-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] dark:disabled:bg-[#0b1425]/70 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props} />
  );
}

export { Textarea }

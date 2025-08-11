import * as React from "react"
import { cn } from "@/src/lib/utils"

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-secondary/30 px-2.5 py-0.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Badge }



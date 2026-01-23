import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-300 file:text-gray-700 placeholder:text-gray-400 selection:bg-teal-100 selection:text-teal-900 flex h-10 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-base text-gray-900 shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 md:text-sm",
        "focus-visible:border-teal-500 focus-visible:ring-teal-500/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-200 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }

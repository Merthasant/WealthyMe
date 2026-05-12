import * as React from "react";

import { cn } from "@/lib/utils";

interface ShadcnInputComponent extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
}

function Input({ className, id, type, icon, ...props }: ShadcnInputComponent) {
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <label htmlFor={id} className="px-2 border-r">
          {icon}
        </label>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-3 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        id={id}
        {...props}
      />
    </div>
  );
}

export { Input };

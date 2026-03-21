import React from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer group">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              "peer h-4 w-4 appearance-none rounded border border-zinc-700 bg-zinc-900 checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all",
              className
            )}
            {...props}
          />
          <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
        </div>
        <span className="text-sm font-medium leading-none text-zinc-300 group-hover:text-zinc-100 transition-colors">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

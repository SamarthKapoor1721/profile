import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { strong?: boolean };

const GlassPanel = forwardRef<HTMLDivElement, Props>(
  ({ className, strong, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl shadow-panel",
        strong ? "glass-strong" : "glass",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

GlassPanel.displayName = "GlassPanel";
export default GlassPanel;

import * as React from "react";
import Link from "next/link";
import { type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";

type LinkButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string };

/**
 * A Button that renders as a Next.js Link. Sets `nativeButton={false}` so Base UI
 * keeps correct (anchor) semantics instead of expecting a native <button>.
 */
export function LinkButton({
  variant,
  size,
  className,
  children,
  ...linkProps
}: LinkButtonProps) {
  return (
    <Button
      render={<Link {...linkProps} />}
      nativeButton={false}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}

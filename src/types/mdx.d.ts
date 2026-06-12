declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const meta: {
    id: string;
    summary?: string;
    interactiveIds?: string[];
  };

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}

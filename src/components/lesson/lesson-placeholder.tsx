import { ConstructionIcon } from "lucide-react";

import { getLesson } from "@/lib/content/curriculum";
import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";

export function LessonPlaceholder({
  title,
  prerequisites,
}: {
  title: string;
  prerequisites?: string[];
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center sm:p-12">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ConstructionIcon className="size-6" />
      </div>
      <h2 className="font-heading mt-4 text-xl font-semibold">{title}</h2>
      <Badge variant="secondary" className="mt-2">
        Coming soon
      </Badge>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
        This lesson is being authored to the same visual-first, interactive standard as Level 1.
        In the meantime, the full Level 1 experience is live and free.
      </p>

      {prerequisites && prerequisites.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Builds on:{" "}
          {prerequisites
            .map((id) => getLesson(id)?.lesson.title ?? id)
            .join(", ")}
        </p>
      )}

      <div className="mt-6 flex justify-center gap-2">
        <LinkButton href="/learn/1/1.1">Start Level 1</LinkButton>
        <LinkButton href="/learn" variant="outline">
          Back to curriculum
        </LinkButton>
      </div>
    </div>
  );
}

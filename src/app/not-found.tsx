import { LinkButton } from "@/components/link-button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <p className="text-gradient font-heading text-7xl font-bold">404</p>
      <h1 className="font-heading mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        That page wandered off. Let&rsquo;s get you back on track.
      </p>
      <div className="mt-7 flex gap-2">
        <LinkButton href="/">Back home</LinkButton>
        <LinkButton href="/#curriculum" variant="outline">
          Browse the curriculum
        </LinkButton>
      </div>
    </section>
  );
}

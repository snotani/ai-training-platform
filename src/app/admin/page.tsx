import { Badge } from "@/components/ui/badge";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Admin</p>
          <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
            Metrics &amp; analytics
          </h1>
        </div>
        <Badge variant="outline" className="mt-1">
          Coming soon
        </Badge>
      </header>
      <AdminDashboard />
    </div>
  );
}

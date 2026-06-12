import { ProfileDashboard } from "@/components/profile/profile-dashboard";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <ProfileDashboard />
    </div>
  );
}

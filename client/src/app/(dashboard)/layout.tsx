"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCouserId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page.</div>;
  return (
    <div className="dashboard-layout">
      <main className="dashboard-layout__main">{children}</main>
    </div>
  );
}

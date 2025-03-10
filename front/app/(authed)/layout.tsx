"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="p-4 w-full">{children}</div>
    </SidebarProvider>
  );
}

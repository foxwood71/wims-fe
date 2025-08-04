// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 👇👇 CSS Grid를 사용해 사이드바와 메인 영역을 나눕니다.
    // SidebarProvider가 AppSidebar를 감싸는 구조는 아주 좋습니다.
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      {/* 1번 열: 사이드바 */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
      </SidebarProvider>
      {/* 2번 열: 메인 콘텐츠 */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center border-b bg-background px-4">
          {/* 헤더 컨텐츠 */}
        </header>
        <main className="flex-1 overflow-auto p-6 bg-slate-100">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
}

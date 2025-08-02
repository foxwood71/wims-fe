// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  return (
    // 👇👇 CSS Grid를 사용해 사이드바와 메인 영역을 나눕니다.
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      {/* 1번 열: 사이드바 너비만큼 자동으로 크기 조절 */}
      <Sidebar />

      {/* 2번 열: 나머지 모든 공간을 차지 */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center border-b bg-background px-4">
          {/* 필요하다면 헤더 컨텐츠 추가 */}
        </header>
        <main className="flex-1 overflow-auto p-6 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

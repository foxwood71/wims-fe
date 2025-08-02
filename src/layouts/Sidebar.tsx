// src/layouts/Sidebar.tsx

import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Scan, Printer, Package, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Sidebar() {
  // isPinned: 사용자가 클릭으로 고정한 상태
  const [isPinned, setIsPinned] = useState(false);
  // isHovered: 마우스 호버 상태
  const [isHovered, setIsHovered] = useState(false);
  // openAccordion: 열려있는 아코디언 메뉴의 ID
  const [openAccordion, setOpenAccordion] = useState("");

  // 최종 확장 상태: 고정되었거나, 호버 중일 때
  const isExpanded = isPinned || isHovered;

  const location = useLocation();
  const navigate = useNavigate();
  // 현재 URL이 '/scan'으로 시작하는지 여부
  const isScanMenuActive = location.pathname.startsWith("/scan");

  // 👇👇👇 useEffect의 로직을 개선했습니다.
  useEffect(() => {
    // 1. 사이드바가 축소되면 무조건 아코디언을 닫습니다.
    if (!isExpanded) {
      setOpenAccordion("");
      return;
    }

    // 2. 사이드바가 확장된 상태일 때,
    // 현재 경로가 스캔 메뉴가 아니면 아코디언을 닫고,
    // 스캔 메뉴이면 아코디언을 엽니다.
    // 사이드바 상태가 변경될 때 아코디언 상태를 조절하는 효과
    if (isScanMenuActive) {
      setOpenAccordion("item-1");
    } else {
      setOpenAccordion("");
    }
    // 의존성 배열에 location.pathname을 추가하여 URL 변경 시마다 이 효과가 실행되도록 합니다.
  }, [isExpanded, location.pathname, isScanMenuActive]);

  // 아코디언 메뉴를 클릭했을 때의 동작
  const handleAccordionToggle = (value: string) => {
    setOpenAccordion((prevValue) => (prevValue === value ? "" : value));
    if (value && !isScanMenuActive) {
      navigate("/scan");
    }
  };

  // 모든 메뉴 아이템에 적용될 스타일 함수
  const getMenuItemClasses = (isActive = false) =>
    cn(
      "flex w-full items-center gap-4 rounded-lg p-3 text-sm text-muted-foreground transition-colors hover:text-primary",
      isActive && "bg-muted text-primary"
    );

  // 하위 메뉴 아이템을 위한 스타일 함수
  const getSubMenuItemClasses = (isActive = false) =>
    cn(
      "flex items-center gap-4 rounded-md p-3 text-sm text-muted-foreground transition-colors hover:text-primary",
      isActive && "bg-muted font-semibold"
    );

  return (
    <aside
      className={cn(
        "bg-background transition-all duration-300 ease-in-out border-r",
        isExpanded ? "w-56" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-14 items-center justify-start px-3">
        <button
          type="button"
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-lg transition-colors focus:outline-none",
            // isPinned 상태에 따라 다른 스타일 적용
            isPinned
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "hover:bg-muted"
          )}
          onClick={() => setIsPinned((prev) => !prev)}
        >
          <Menu size={20} className="shrink-0" />
        </button>
      </div>

      <nav className="space-y-1 p-2">
        <NavLink
          to="/"
          className={({ isActive }) => getMenuItemClasses(isActive)}
          end
        >
          <Home size={20} className="shrink-0" />
          <span className={cn("whitespace-nowrap", !isExpanded && "hidden")}>
            대시보드
          </span>
        </NavLink>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordion}
          onValueChange={handleAccordionToggle}
        >
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger
              disabled={!isExpanded}
              className={cn(
                getMenuItemClasses(isScanMenuActive),
                "hover:no-underline",
                "[&[data-state=open]>svg:last-child]:rotate-180",
                !isExpanded && "[&>svg:last-child]:hidden"
              )}
            >
              <Scan size={20} className="shrink-0" />
              <span
                className={cn(
                  "flex-1 text-left whitespace-nowrap",
                  !isExpanded && "hidden"
                )}
              >
                스캔하기
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pl-8">
              <NavLink
                to="/scan/new"
                className={({ isActive }) => getSubMenuItemClasses(isActive)}
              >
                새 스캔
              </NavLink>
              <NavLink
                to="/scan/history"
                className={({ isActive }) => getSubMenuItemClasses(isActive)}
              >
                스캔 기록
              </NavLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <NavLink
          to="/printer"
          className={({ isActive }) => getMenuItemClasses(isActive)}
        >
          <Printer size={20} className="shrink-0" />
          <span className={cn("whitespace-nowrap", !isExpanded && "hidden")}>
            프린터
          </span>
        </NavLink>

        <NavLink
          to="/package"
          className={({ isActive }) => getMenuItemClasses(isActive)}
        >
          <Package size={20} className="shrink-0" />
          <span className={cn("whitespace-nowrap", !isExpanded && "hidden")}>
            패키지
          </span>
        </NavLink>
      </nav>
    </aside>
  );
}

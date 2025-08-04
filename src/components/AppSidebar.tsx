import React, { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar"; // 훅을 import 합니다.
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  CornerDownRight,
  User,
  Users,
  Shield,
  Menu,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
  { id: "home", title: "Home", url: "#", icon: Home },
  {
    id: "inbox",
    icon: Inbox,
    title: "Inbox",
    url: "#",
    roles: ["admin"],
    subItems: [
      {
        id: "inbox-all",
        icon: CornerDownRight,
        title: "All",
        url: "#",
        roles: ["admin"],
      },
      {
        id: "inbox-important",
        icon: CornerDownRight,
        title: "Important",
        url: "#",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "Calendar",
    url: "#",
    roles: ["guest", "user", "admin"],
    subItems: [
      {
        id: "today",
        icon: CornerDownRight,
        title: "Today",
        url: "#",
        roles: ["guest", "user", "admin"],
      },
    ],
  },
  {
    id: "search",
    icon: Search,
    title: "Search",
    url: "#",
    roles: ["guest", "user", "admin"],
  },
  {
    id: "settings",
    icon: Settings,
    title: "Settings",
    url: "#",
    roles: ["guest", "user", "admin"],
  },
];

// 역할별 표시 정보를 객체로 관리하면 편리합니다.
const roleDetails = {
  guest: { label: "Guest View", icon: Users },
  user: { label: "User View", icon: User },
  admin: { label: "Admin View", icon: Shield },
};

// 드롭다운 전용 컴포넌트 분리
function UserSelector({
  currentUserRole,
  setCurrentUserRole,
}: {
  currentUserRole: "guest" | "user" | "admin";
  setCurrentUserRole: React.Dispatch<
    React.SetStateAction<"guest" | "user" | "admin">
  >;
}) {
  const CurrentIcon = roleDetails[currentUserRole].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* 현재 선택된 역할을 표시합니다. */}
        <SidebarMenuButton>
          <CurrentIcon size={16} className="mr-2" />
          <span className="flex-grow">
            {roleDetails[currentUserRole].label}
          </span>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
        {/* 역할 목록을 동적으로 생성합니다. */}
        {Object.entries(roleDetails).map(([role, details]) => (
          <DropdownMenuItem
            key={role}
            // 메뉴 아이템 클릭 시 역할 변경 함수를 호출합니다.
            onClick={() => setCurrentUserRole(role as "user" | "admin")}
          >
            <details.icon size={16} className="mr-2" />
            <span>{details.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 메뉴 리스트 렌더링 컴포넌트
function SidebarMenuList({
  activeId,
  setActiveId,
  currentUserRole, // 사용자 역할을 props로 받는다고 가정
  openSubmenus, // 부모로부터 받은 열린 메뉴 Set
  setOpenSubmenus, // 부모로부터 받은 Set 업데이트 함수
}: {
  activeId: string;
  setActiveId: React.Dispatch<React.SetStateAction<string>>;
  currentUserRole: string; // 예: "user", "admin" 등
  openSubmenus: Set<string>;
  setOpenSubmenus: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  // items 배열이 내부에 있다고 가정하거나 import 되어 있음
  // 필터링된 items 생성
  const filteredItems = items
    .filter((item) => item.roles?.includes(currentUserRole) ?? true)
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (sub) => sub.roles?.includes(currentUserRole) ?? true
      ),
    }));
  // 서브메뉴 열림/닫힘 상태를 중앙에서 관리하는 함수
  const handleSubmenuToggle = (id: string, isOpen: boolean) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const hasSubItems =
          Array.isArray(item.subItems) && item.subItems.length > 0;

        if (hasSubItems) {
          // 서브메뉴 렌더링 로직 (수정된 부분)
          return (
            <SidebarMenuItem key={item.id}>
              <Collapsible
                // open과 onOpenChange를 부모 상태와 연결
                open={openSubmenus.has(item.id)}
                onOpenChange={(isOpen) => handleSubmenuToggle(item.id, isOpen)}
              >
                <SidebarMenuButton asChild>
                  {/* * 수정 포인트:
                   * 1. 불필요한 내부 div 제거
                   * 2. CollapsibleTrigger에 직접 flex와 space-x-2 적용
                   * 3. 아이콘, 텍스트, 펼침 아이콘을 Trigger의 직계 자식으로 배치
                   */}
                  <CollapsibleTrigger className="flex w-full items-center space-x-2">
                    <item.icon
                      size={16}
                      strokeWidth={1.5}
                      className="h-4 w-4"
                    />
                    <span>{item.title}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className="ml-auto transition-transform data-[state=open]:rotate-180"
                    />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
                <CollapsibleContent className="pl-6">
                  <SidebarMenu>
                    {item.subItems!.map((sub) => (
                      <SidebarMenuItem
                        key={sub.id}
                        className={
                          activeId === sub.id ? "bg-blue-400 text-white" : ""
                        }
                      >
                        <SidebarMenuButton
                          asChild
                          onClick={() => setActiveId(sub.id)}
                          isActive={activeId === sub.id}
                        >
                          {/* * 수정 포인트:
                           * 1. <a> 태그에 flex와 space-x-2 클래스 추가
                           * 2. <sub.icon> 컴포넌트 렌더링
                           * 3. 텍스트를 <span>으로 감싸기 (선택사항이지만 일관성을 위해 추천)
                           */}
                          <a
                            href={sub.url}
                            className="flex items-center space-x-2"
                          >
                            <sub.icon
                              size={16}
                              strokeWidth={1.5}
                              className="h-4 w-4"
                            />
                            <span>{sub.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          );
        }

        // 서브메뉴 없는 일반 메뉴 렌더링 (기존과 동일)
        return (
          <SidebarMenuItem
            key={item.id}
            className={activeId === item.id ? "bg-blue-500 text-white" : ""}
          >
            <SidebarMenuButton
              asChild
              onClick={() => setActiveId(item.id)}
              isActive={activeId === item.id}
            >
              <a href={item.url} className="flex items-center space-x-2">
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  // 1. ✍️ `state` 객체와 `toggleSidebar` 함수를 가져옵니다.
  const { state, toggleSidebar } = useSidebar();
  // 2. ✍️ 데스크톱의 축소 상태는 state.collapsed로 접근합니다.
  //    (optional chaining `?.`으로 안전하게 접근)
  const isCollapsed = state === "collapsed";

  // 2. 나머지 UI 상태는 그대로 `useState`로 관리합니다.
  const [activeId, setActiveId] = useState<string>("home");
  const [currentUserRole, setCurrentUserRole] = useState<
    "guest" | "user" | "admin"
  >("admin");
  const [openSubmenus, setOpenSubmenus] = useState(new Set<string>());

  // 3. ✍️ useEffect가 isCollapsed 상태를 감시하도록 합니다.
  useEffect(() => {
    // 사이드바가 축소되면(isCollapsed가 true가 되면) 서브메뉴를 닫습니다.
    if (isCollapsed) {
      setOpenSubmenus(new Set());
    }
  }, [isCollapsed]);

  // ✍️ 마우스가 헤더 영역에 들어가면 사이드바를 축소 (아이콘만 보이게)
  const handleMouseEnter = () => {
    if (isCollapsed) {
      toggleSidebar();
    }
  };

  // ✍️ 마우스가 사이드바 영역에서 벗어나면 사이드바를 확장
  const handleMouseLeave = () => {
    if (!isCollapsed) {
      toggleSidebar();
    }
  };
  return (
    <Sidebar
      collapsible="icon"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* 2. 햄버거 메뉴 버튼에 onClick 핸들러 추가 */}
            <SidebarMenuButton onClick={toggleSidebar}>
              <Menu size={20} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuList
              activeId={activeId}
              setActiveId={setActiveId}
              currentUserRole={currentUserRole}
              // 중앙 관리 상태와 함수를 props로 전달
              openSubmenus={openSubmenus}
              setOpenSubmenus={setOpenSubmenus}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserSelector
              currentUserRole={currentUserRole}
              setCurrentUserRole={setCurrentUserRole}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

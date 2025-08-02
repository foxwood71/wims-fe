// src/App.tsx

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { PairingPage } from "./pages/PairingPage";

/**
 * 앱의 첫 진입점을 결정하는 컴포넌트입니다.
 * 로그인된 사용자를 페어링 상태에 따라 적절한 초기 페이지로 보냅니다.
 */
function InitialRedirect() {
  const { needsPairing } = useAuth();
  // 페어링이 필요하면 /pairing으로, 아니면 /dashboard로 보냅니다.
  return needsPairing ? (
    <Navigate to="/pairing" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

/**
 * 사용자가 로그인(인증)했는지 확인하는 보호막 컴포넌트입니다.
 */
function PrivateRoutes() {
  // 현재는 항상 로그인된 상태로 가정합니다.
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/pairing" replace />;
}

const router = createBrowserRouter([
  {
    // 모든 경로는 우선 PrivateRoutes의 보호를 받습니다.
    path: "/",
    element: <PrivateRoutes />,
    children: [
      {
        // 👇👇 핵심 변경: MainLayout이 모든 페이지의 공통 레이아웃이 됩니다.
        element: <MainLayout />,
        children: [
          {
            // 사용자가 처음 들어오는 경로 '/'는 InitialRedirect가 처리합니다.
            index: true,
            element: <InitialRedirect />,
          },
          {
            // 대시보드 페이지 경로
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            // 페어링 페이지 경로 (이제 MainLayout 안에서 보입니다)
            path: "pairing",
            element: <PairingPage />,
          },
          {
            path: "scan",
            element: <div>스캔 페이지</div>,
          },
          {
            path: "scan/new",
            element: <div>새 스캔 페이지</div>,
          },
          {
            path: "scan/history",
            element: <div>스캔 기록 페이지</div>,
          },
          {
            path: "printer",
            element: <div>프린터 페이지</div>,
          },
          {
            path: "package",
            element: <div>패키지 페이지</div>,
          },
        ],
      },
    ],
  },
]);

function App() {
  // 현재는 항상 로그인된 상태이므로, 인증 확인 로직을 비활성화합니다.
  // const { isAuthenticating } = useAuth();
  // if (isAuthenticating) {
  //     return <div className="flex min-h-screen w-full items-center justify-center">인증 정보 확인 중...</div>;
  // }

  return <RouterProvider router={router} />;
}

export default App;

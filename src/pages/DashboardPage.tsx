// src/pages/DashboardPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ◀◀ useNavigate를 import 합니다.
import * as signalR from "@microsoft/signalr";
import { useAuth } from "@/hooks/useAuth";
import { signalRService } from "@/services/signalRService";
import { PrinterCard } from "@/components/PrinterCard";
import { ScannerCard } from "@/components/ScannerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { sessionToken, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // ◀◀ 페이지 이동 함수를 초기화합니다.

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      signalRService.startConnection();

      const interval = setInterval(() => {
        const state = signalRService.getConnectionState();
        setIsConnected(state === signalR.HubConnectionState.Connected);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  /**
   * 로그아웃을 처리하고 페어링 페이지로 이동하는 함수입니다.
   */
  const handleLogout = () => {
    logout(); // 기존 로그아웃 로직 실행
    navigate("/pairing", { replace: true }); // 페어링 페이지로 즉시 이동
  };

  return (
    <div className="w-full">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            React 로컬 브릿지
          </h1>
          <p className="text-sm text-gray-600">
            C# 브릿지 앱과 안전하게 통신합니다.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isConnected ? "default" : "secondary"}>
            SignalR: {isConnected ? "연결됨" : "끊김"}
          </Badge>
          {/* 👇👇 버튼의 onClick 이벤트를 새로 만든 핸들러로 교체합니다. */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            연결 해제
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sessionToken && (
          <>
            <PrinterCard sessionToken={sessionToken} />
            <ScannerCard sessionToken={sessionToken} />
          </>
        )}
      </main>
    </div>
  );
}

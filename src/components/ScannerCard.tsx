// src/components/ScannerCard.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as api from "../services/api";
// SignalR 서비스와 타입 정의를 직접 임포트합니다.
import {
  signalRService,
  type ScanResultPayload,
  type BatchScanProgressPayload,
} from "../services/signalRService";

interface ScannerCardProps {
  sessionToken: string;
  // lastMessage prop은 더 이상 필요 없으므로 제거합니다.
}

export const ScannerCard: React.FC<ScannerCardProps> = ({ sessionToken }) => {
  // 스캔된 내용을 로그처럼 쌓기 위해 문자열 배열로 변경합니다.
  const [scannedContent, setScannedContent] = useState<string[]>([]);
  const [scanStatus, setScanStatus] = useState("");
  const [isReady, setIsReady] = useState<boolean | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const result = await api.getScannerStatus(sessionToken);
      setIsReady(result.is_ready);
    } catch {
      setIsReady(null);
    }
  }, [sessionToken]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  // SignalR 이벤트를 구독하고 해제하는 useEffect 훅
  useEffect(() => {
    // 단일 스캔 결과 처리
    const handleSingleScan = (payload: ScanResultPayload) => {
      setScannedContent((prev) => [`[단일 스캔] ${payload.content}`, ...prev]);
      setScanStatus("단일 스캔 완료 (SignalR)");
    };

    // 배치 스캔 진행 상황 처리
    const handleBatchProgress = (payload: BatchScanProgressPayload) => {
      const logMessage = `[배치 ${payload.currentPage}/${payload.totalPages}] ${payload.content}`;
      setScannedContent((prev) => [logMessage, ...prev]);
    };

    // 배치 스캔 완료 처리
    const handleBatchCompleted = (payload: { totalScans: number }) => {
      const logMessage = `✅ 총 ${payload.totalScans}장의 배치 스캔이 모두 완료되었습니다!`;
      setScannedContent((prev) => [logMessage, ...prev]);
      setScanStatus("배치 스캔 완료");
    };

    // 서비스에 정의된 이벤트 핸들러들을 등록합니다.
    signalRService.on("SINGLE_SCAN_RESULT", handleSingleScan);
    signalRService.on("BATCH_SCAN_PROGRESS", handleBatchProgress);
    signalRService.on("BATCH_SCAN_COMPLETED", handleBatchCompleted);

    // 컴포넌트가 언마운트될 때(사라질 때) 등록했던 핸들러들을 반드시 정리(해제)해야 합니다.
    // 이렇게 하지 않으면 메모리 누수가 발생할 수 있습니다.
    return () => {
      signalRService.off("SINGLE_SCAN_RESULT", handleSingleScan);
      signalRService.off("BATCH_SCAN_PROGRESS", handleBatchProgress);
      signalRService.off("BATCH_SCAN_COMPLETED", handleBatchCompleted);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.

  const handleScan = async () => {
    setScanStatus("스캔 요청 중...");
    try {
      // API를 호출하는 로직은 동일합니다.
      const result = await api.sendScanRequest(sessionToken);
      setScanStatus(result.message || "스캔 요청 완료");
    } catch (error) {
      if (error instanceof Error) {
        setScanStatus(error.message);
      } else {
        setScanStatus("알 수 없는 스캔 오류가 발생했습니다.");
      }
    }
  };

  const getStatusVariant = (): "default" | "destructive" | "secondary" => {
    if (isReady === null) return "destructive";
    return isReady ? "default" : "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>스캐너 기능</span>
          <Badge variant={getStatusVariant()}>
            {isReady === null ? "연결 오류" : isReady ? "준비됨" : "준비 안됨"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 스캔 로그를 표시하도록 ul/li 태그로 변경 */}
        <div className="rounded-md border bg-slate-50 p-3 min-h-[120px] text-sm overflow-y-auto">
          <ul className="space-y-1">
            {scannedContent.length === 0 && (
              <li className="text-gray-400">
                스캔된 내용이 여기에 표시됩니다.
              </li>
            )}
            {scannedContent.map((content, index) => (
              <li key={index}>{content}</li>
            ))}
          </ul>
        </div>
        <Button className="w-full" onClick={handleScan} disabled={!isReady}>
          단일 스캔하기 (API 호출)
        </Button>
        {scanStatus && (
          <p className="text-sm text-gray-600 mt-2">{scanStatus}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScannerCard;

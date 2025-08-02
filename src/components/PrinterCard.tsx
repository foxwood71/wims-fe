// src/components/PrinterCard.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import * as api from "../services/api";

interface PrinterCardProps {
  sessionToken: string;
}

export const PrinterCard: React.FC<PrinterCardProps> = ({ sessionToken }) => {
  const [printText, setPrintText] = useState("");
  const [printStatus, setPrintStatus] = useState("");
  const [isReady, setIsReady] = useState<boolean | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const result = await api.getPrinterStatus(sessionToken);
      setIsReady(result.is_ready);
    } catch {
      setIsReady(null);
    }
  }, [sessionToken]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // 5초마다 상태 확인
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handlePrint = async () => {
    if (!printText.trim()) {
      setPrintStatus("인쇄할 내용을 입력해주세요.");
      return;
    }
    setPrintStatus("인쇄 요청 중...");
    try {
      const result = await api.sendPrintRequest(sessionToken, printText);
      setPrintStatus(result.message || "인쇄 요청 완료");
      setPrintText("");
    } catch (error) {
      // 👈 'any' 타입을 제거하고 아래에서 타입을 확인합니다.
      // 👈 error가 Error 인스턴스인지 확인하여 안전하게 message 속성에 접근합니다.
      if (error instanceof Error) {
        setPrintStatus(error.message);
      } else {
        setPrintStatus("알 수 없는 인쇄 오류가 발생했습니다.");
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
          <span>인쇄 기능</span>
          <Badge variant={getStatusVariant()}>
            {isReady === null ? "연결 오류" : isReady ? "준비됨" : "준비 안됨"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="print-input">인쇄할 내용</Label>
          <div className="flex w-full items-center space-x-2">
            <Input
              id="print-input"
              value={printText}
              onChange={(e) => setPrintText(e.target.value)}
            />
            <Button onClick={handlePrint} disabled={!isReady}>
              인쇄하기
            </Button>
          </div>
          {printStatus && (
            <p className="text-sm text-gray-600 mt-2">{printStatus}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

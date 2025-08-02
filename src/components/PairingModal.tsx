// src/components/PairingModal.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PairingModalProps {
  onStartPairing: () => void;
  onSubmitCode: (code: string) => void;
  error: string;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  onStartPairing,
  onSubmitCode,
  error,
}) => {
  const [code, setCode] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>브릿지 앱과 연결</CardTitle>
          <CardDescription>
            PC에서 실행 중인 로컬 브릿지 앱과 연결해야 합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            아래 버튼을 눌러 페어링 코드를 요청하세요. PC 화면에 코드가
            나타납니다.
          </p>
          <Button onClick={onStartPairing} className="w-full">
            페어링 코드 요청
          </Button>
          <div className="space-y-2">
            <label htmlFor="pairing-code" className="text-sm font-medium">
              화면에 표시된 6자리 코드를 입력하세요
            </label>
            <Input
              id="pairing-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onSubmitCode(code)}
            className="w-full"
            disabled={code.length !== 6}
          >
            연결하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

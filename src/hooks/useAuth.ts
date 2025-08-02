// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

const SESSION_TOKEN_KEY = "bridge_session_token";

export const useAuth = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [needsPairing, setNeedsPairing] = useState(false);
  const [pairingError, setPairingError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem(SESSION_TOKEN_KEY);
    if (storedToken) {
      setSessionToken(storedToken);
    } else {
      setNeedsPairing(true);
    }
    setIsAuthenticating(false);
  }, []);

  const startPairing = useCallback(async () => {
    try {
      await api.requestPairingCode();
      setPairingError(""); // 이전 오류 메시지 초기화
    } catch (error) {
      console.error("페어링 코드 요청 실패:", error);
      setPairingError(
        "페어링 코드 요청에 실패했습니다. 브릿지 앱이 실행 중인지 확인하세요."
      );
    }
  }, []);

  const submitPairingCode = useCallback(async (code: string) => {
    try {
      const data = await api.validatePairingCode(code);
      if (data.session_token) {
        localStorage.setItem(SESSION_TOKEN_KEY, data.session_token);
        setSessionToken(data.session_token);
        setNeedsPairing(false);
        setPairingError("");
      }
    } catch (error) {
      // 👈 'any' 타입을 제거하고 아래에서 타입을 확인합니다.
      console.error("페어링 코드 검증 실패:", error);
      // 👈 error가 Error 인스턴스인지 확인하여 안전하게 message 속성에 접근합니다.
      if (error instanceof Error) {
        setPairingError(error.message);
      } else {
        setPairingError("알 수 없는 오류가 발생했습니다.");
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setSessionToken(null);
    setNeedsPairing(true);
  }, []);

  return {
    sessionToken,
    isAuthenticated: !!sessionToken,
    isAuthenticating,
    needsPairing,
    pairingError,
    startPairing,
    submitPairingCode,
    logout,
  };
};

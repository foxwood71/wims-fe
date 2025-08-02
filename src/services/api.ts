// src/services/api.ts

//export const API_BASE_URL = "http://localhost:8000"; // Python 서버 포트
export const API_BASE_URL = "http://localhost:1789"; // C# 서버 포트

interface ApiOptions extends RequestInit {
  sessionToken?: string | null;
}

/**
 * 범용 API 요청 헬퍼 함수
 * @param endpoint API 엔드포인트 (예: /printer/status)
 * @param options fetch 옵션 및 세션 토큰
 * @returns 응답 JSON 데이터
 */
const apiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const { sessionToken, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers || {});
  if (sessionToken) {
    headers.set("X-Session-Token", sessionToken);
  }
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "알 수 없는 서버 오류" }));
      throw new Error(errorData.detail || "서버 요청에 실패했습니다.");
    }
    // 내용이 없는 응답(204 No Content 등)을 처리
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`API 요청 오류 (${endpoint}):`, error);
    throw error;
  }
};

// --- 페어링 API ---
export const requestPairingCode = () =>
  apiRequest("/pairing/request-code", { method: "POST" });
export const validatePairingCode = (pairing_code: string) =>
  apiRequest("/pairing/validate-code", {
    method: "POST",
    body: JSON.stringify({ pairing_code }),
  });

// --- 프린터 API ---
export const getPrinterStatus = (token: string) =>
  apiRequest("/printer/status", { sessionToken: token });
export const sendPrintRequest = (token: string, content: string) =>
  apiRequest("/printer/print", {
    method: "POST",
    body: JSON.stringify({ content }),
    sessionToken: token,
  });

// --- 스캐너 API ---
export const getScannerStatus = (token: string) =>
  apiRequest("/scanner/status", { sessionToken: token });
export const sendScanRequest = (token: string) =>
  apiRequest("/scanner/scan", { method: "POST", sessionToken: token });

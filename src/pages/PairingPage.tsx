// src/pages/PairingPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PairingModal } from "@/components/PairingModal";

export function PairingPage() {
  // useAuth에서 isAuthenticated 상태를 추가로 가져옵니다.
  const { startPairing, submitPairingCode, pairingError, isAuthenticated } =
    useAuth();
  const navigate = useNavigate();

  /**
   * useEffect 훅을 사용하여 isAuthenticated 상태의 변화를 감지합니다.
   */
  useEffect(() => {
    // 만약 인증 상태가 true가 되면 (페어링 성공 시),
    if (isAuthenticated) {
      // 메인 페이지('/')로 이동시킵니다.
      navigate("/", { replace: true });
    }
    // 이 로직은 isAuthenticated 값이 바뀔 때마다 실행됩니다.
  }, [isAuthenticated, navigate]);

  /**
   * 페어링 코드를 제출하는 함수입니다.
   */
  const handleCodeSubmit = (code: string) => {
    submitPairingCode(code);
  };

  return (
    <PairingModal
      onStartPairing={startPairing}
      onSubmitCode={handleCodeSubmit}
      error={pairingError}
    />
  );
}

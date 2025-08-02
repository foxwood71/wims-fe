import * as signalR from "@microsoft/signalr";

// C# 백엔드에서 보낼 데이터 타입 정의
export interface ScanResultPayload {
  type: string;
  content: string;
}
export interface BatchScanProgressPayload {
  type: string;
  currentPage: number;
  totalPages: number;
  content: string;
}

class SignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    // C# 백엔드의 Hub 주소
    const hubUrl = "http://localhost:1789/bridgeHub";

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
  }

  public startConnection = async () => {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(this.startConnection, 5000);
      }
    }
  };

  public on = (eventName: string, callback: (...args: any[]) => void) => {
    this.connection.on(eventName, callback);
  };

  public off = (eventName: string, callback: (...args: any[]) => void) => {
    this.connection.off(eventName, callback);
  };

  public getConnectionState = () => this.connection.state;
}

export const signalRService = new SignalRService();

import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

@WebSocketGateway()
export class DebugGateway {
  private readonly logger = new Logger(DebugGateway.name);

  @WebSocketServer()
  private readonly server: Server

  @SubscribeMessage('debug.join')
  public handleJoin(
    @MessageBody() sessionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Client ${client.id} joined debug session ${sessionId}`);
    client.join(sessionId)
    this.server.to(sessionId).emit("debug.joined", { sessionId });
  }

  public sendLog(sessionId: string, data: string) {
    this.server.to(sessionId).emit("debug.log", {
      sessionId,
      timestamp: Date.now(),
      message: data,
    })
  }
}

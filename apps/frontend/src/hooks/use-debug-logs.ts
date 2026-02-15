import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import type {z} from "zod";
import { startDebug } from "@/actions/debug";
import type { generatorFormSchema } from "@/forms/generator-form-schema";

type DebugLogPayload = {
	sessionId: string;
	timestamp: number;
	message: string;
};

export function useDebugSocket(
	sessionId: string,
	dataToDebug: z.infer<ReturnType<typeof generatorFormSchema>>,
	onChunk: (data: DebugLogPayload) => void
) {
	useEffect(() => {
		if (!sessionId) return;

		const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

		socket.on("connect", () => {
			socket.emit("debug.join", sessionId);
		});

		socket.on("debug.joined", async () => {
			startDebug(dataToDebug, sessionId);
		});

		socket.on("debug.log", (chunk: DebugLogPayload) => {
			onChunk(chunk);
		});

		return () => {
			socket.disconnect();
		};
	}, [sessionId, onChunk, dataToDebug]);
}

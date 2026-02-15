"use client";

import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import { draculaTheme } from "@/constants/terminal-theme";
import { useDebugSocket } from "@/hooks/use-debug-logs";
import type { GeneratorFormDataType } from "@/types/form";

type Props = {
	sessionId: string;
	dataToDebug: GeneratorFormDataType;
};

export function DebugTerminalClient({ sessionId, dataToDebug }: Props) {
	const terminalRef = useRef<HTMLDivElement>(null);
	const xtermRef = useRef<Terminal | null>(null);
	const fitRef = useRef<FitAddon | null>(null);

	useEffect(() => {
		if (!terminalRef.current) return;
		if (xtermRef.current) return;

		const terminal = new Terminal({
			theme: draculaTheme,
			fontFamily: "monospace",
			fontSize: 12,
			disableStdin: true,
			cursorBlink: false,
			scrollback: 10000,
			convertEol: true
		});

		const fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);
		terminal.loadAddon(new WebLinksAddon());

		terminal.open(terminalRef.current);
		fitAddon.fit();

		xtermRef.current = terminal;
		fitRef.current = fitAddon;

		const handleResize = () => fitAddon.fit();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			terminal.dispose();
			xtermRef.current = null;
			fitRef.current = null;
		};
	}, []);

	useDebugSocket(sessionId, dataToDebug, (chunk) => {
		xtermRef.current?.writeln(chunk.message);
	});

	return <div ref={terminalRef} className="h-full w-full bg-black p-3" />;
}

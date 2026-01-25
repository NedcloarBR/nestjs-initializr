"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HealthResponse = { status?: string; [k: string]: unknown };

function isAbortError(err: unknown): boolean {
	return err instanceof Error && err.name === "AbortError";
}

function getStatusIndicatorClass(loading: boolean, status: string | null): string {
	if (loading) {
		return "h-3 w-3 animate-pulse rounded-full bg-slate-300";
	}
	if (status === "ok") {
		return "h-3 w-3 animate-pulse rounded-full bg-emerald-500";
	}
	return "h-3 w-3 rounded-full bg-rose-500";
}

export function ApiStatus({ pollIntervalMs = 15000 }: { pollIntervalMs?: number }) {
	const t = useTranslations("ApiStatus");
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<string | null>(null);
	const [details, setDetails] = useState<HealthResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [lastChecked, setLastChecked] = useState<string | null>(null);
	const [isHovered, setIsHovered] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovered(false);
		}, 100);
	};

	useEffect(() => {
		let mounted = true;
		const controller = new AbortController();

		async function handleSuccess(json: HealthResponse) {
			setStatus((json && (json.status as string)) || "ok");
			setDetails(json);
		}

		async function handleError(err: unknown) {
			if (isAbortError(err)) return;
			setStatus("down");
			setError(err instanceof Error ? err.message : String(err));
			setDetails(null);
		}

		async function handleResponse(res: Response) {
			if (!mounted) return;
			if (!res.ok) {
				setStatus("down");
				setError(`HTTP ${res.status}`);
				setDetails(null);
				return;
			}
			const json = (await res.json()) as HealthResponse;
			await handleSuccess(json);
		}

		async function fetchOnce() {
			try {
				const res = await fetch("/api/health", { signal: controller.signal, cache: "no-store" });
				await handleResponse(res);
			} catch (err) {
				await handleError(err);
			} finally {
				if (mounted) {
					setLoading(false);
					setLastChecked(new Date().toISOString());
				}
			}
		}

		fetchOnce();
		const iv = setInterval(fetchOnce, pollIntervalMs);
		return () => {
			mounted = false;
			controller.abort();
			clearInterval(iv);
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, [pollIntervalMs]);

	const indicatorClass = getStatusIndicatorClass(loading, status);

	const formatDate = (isoString: string | null) => {
		if (!isoString) return "-";
		const date = new Date(isoString);
		return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
	};

	const getStatusLabel = () => {
		if (loading) return t("statusValues.checking");
		if (error) return t("statusValues.error");
		if (status === "ok") return t("statusValues.ok");
		return t("statusValues.unknown");
	};

	const getAriaLabel = () => {
		const statusLabel = loading ? t("statusValues.checking") : (status ?? t("statusValues.unknown"));
		return t("ariaLabel", { status: statusLabel });
	};

	return (
		<div ref={rootRef} className="group relative inline-flex items-center">
			<button
				type="button"
				className="flex cursor-help items-center rounded-full p-1 transition-colors hover:bg-muted"
				aria-label={getAriaLabel()}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}>
				<span className={cn(indicatorClass)} />
			</button>

			{isHovered && (
				<div
					className="fade-in slide-in-from-top-1 -translate-x-1/2 absolute top-full left-1/2 z-50 mt-2 w-64 origin-top animate-in duration-200"
					role="tooltip"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					<div className="rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg">
						<div className="mb-2 flex items-center gap-2">
							<span className={cn(indicatorClass)} />
							<span className="font-semibold text-sm">{t("title")}</span>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">{t("status")}</span>
								<span
									className={cn("font-medium", error ? "text-rose-500" : status === "ok" ? "text-emerald-500" : "")}>
									{getStatusLabel()}
								</span>
							</div>

							{error && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">{t("error")}</span>
									<span className="font-medium text-rose-500">{error}</span>
								</div>
							)}

							<div className="flex justify-between">
								<span className="text-muted-foreground">{t("lastChecked")}</span>
								<span className="font-mono text-xs">{formatDate(lastChecked)}</span>
							</div>

							<div className="border-border border-t pt-2">
								<span className="text-muted-foreground text-xs">
									{t("autoRefresh", { seconds: Math.round(pollIntervalMs / 1000) })}
								</span>
							</div>

							{details && status === "ok" && (
								<details className="border-border border-t pt-2">
									<summary className="cursor-pointer text-muted-foreground text-xs hover:text-foreground">
										{t("technicalDetails")}
									</summary>
									<pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 font-mono text-[10px]">
										{JSON.stringify(details, null, 2)}
									</pre>
								</details>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

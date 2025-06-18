"use client";

import type { ConfigStructure } from "@/actions";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	ScrollArea
} from "@/components/ui";
import { HistoryIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function RecentHistory() {
	const t = useTranslations("RecentHistory");

	const [recentHistory, setRecentHistory] = useState<ConfigStructure[]>([]);

	function fetchRecentHistory() {
		try {
			const data = localStorage.getItem("recentHistory");
			if (data) {
				setRecentHistory(JSON.parse(data) as ConfigStructure[]);
			} else {
				setRecentHistory([]);
			}
		} catch {
			setRecentHistory([]);
		}
	}

	const hasRecentHistory = recentHistory && recentHistory.length > 0;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button onClick={fetchRecentHistory}>
					<HistoryIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				{hasRecentHistory ? (
					<ScrollArea className="max-h-[400px]">
						{recentHistory.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={index} className="mb-2 rounded-md border p-2">
								<p className="font-semibold text-lg">{item.packageJson?.name}</p>
								<p className="text-gray-600 text-sm">{item.packageJson?.description}</p>
							</div>
						))}
					</ScrollArea>
				) : (
					<p className="text-gray-600">{t("empty")}</p>
				)}
			</DialogContent>
		</Dialog>
	);
}

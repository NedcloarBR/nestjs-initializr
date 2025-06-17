"use client";

import type { ConfigStructure } from "@/actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { HistoryIcon } from "lucide-react";
import { useState } from "react";

export function RecentHistory() {
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
					<DialogTitle>Recent History</DialogTitle>
					<DialogDescription>Recent Projects Generated</DialogDescription>
				</DialogHeader>
				{hasRecentHistory ? (
					<div>
						{recentHistory.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={index} className="mb-2 rounded-md border p-2">
								<h3 className="font-semibold text-lg">{item.packageJson?.name}</h3>
								<p className="text-gray-600 text-sm">{item.packageJson?.description}</p>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-600">No recent history available.</p>
				)}
			</DialogContent>
		</Dialog>
	);
}

"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	ScrollArea,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@/components/ui";
import type { ConfigStructure } from "@/types/config";
import { clearRecentHistory as clearHistory, getRecentHistory } from "@/utils/history";
import { ArrowBigRightIcon, HistoryIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
	loadData: (data: ConfigStructure) => void;
}

export function RecentHistory({ loadData }: Props) {
	const t = useTranslations("RecentHistory");
	const [recentHistory, setRecentHistory] = useState<ConfigStructure[]>([]);

	const hasRecentHistory = recentHistory.length > 0;

	const handleGetRecentHistory = () => {
		const history = getRecentHistory();
		setRecentHistory(history);
	};

	const handleClearHistory = () => {
		clearHistory();
		setRecentHistory([]);
	};

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button className="cursor-pointer" onClick={handleGetRecentHistory}>
							<HistoryIcon />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("tooltip")}</TooltipContent>
			</Tooltip>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				{hasRecentHistory ? (
					<ScrollArea className="max-h-[400px]">
						{recentHistory.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={index} className="mb-2 flex rounded-md border p-2">
								<div>
									<p className="font-semibold text-lg">{item.packageJson?.name}</p>
									<p className="text-gray-600 text-sm">{item.packageJson?.description}</p>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => loadData(item)}
									className="mt-2 mr-2 cursor-pointer">
									<ArrowBigRightIcon />
								</Button>
							</div>
						))}
					</ScrollArea>
				) : (
					<p className="text-gray-600">{t("empty")}</p>
				)}
				<DialogFooter>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className="cursor-pointer" onClick={handleClearHistory}>
								<Trash2Icon />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{t("clear")}</TooltipContent>
					</Tooltip>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

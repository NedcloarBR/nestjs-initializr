import type { ConfigStructure } from "@/types/config";

const STORAGE_KEY = "recentHistory";
const MAX_HISTORY = 10;

function hashObject(obj: unknown): string {
	const json = JSON.stringify(obj);
	return Buffer.from(json, "utf-8").toString("base64").slice(-20);
}

export function getRecentHistory(): ConfigStructure[] {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? (JSON.parse(data) as ConfigStructure[]) : [];
	} catch {
		return [];
	}
}

export function addRecentHistory(newItem: ConfigStructure) {
	const existing = getRecentHistory();

	const newHash = hashObject(newItem);
	console.log("New Hash:", newHash); // Debugging line

	const alreadyExists = existing.some((item) => hashObject(item) === newHash);
	console.log("Already Exists:", alreadyExists); // Debugging line

	if (!alreadyExists) {
		console.log("Adding new item to history"); // Debugging line
		const updated = [...existing, newItem];

		if (updated.length > MAX_HISTORY) updated.shift();

		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	}
}

export function clearRecentHistory() {
	localStorage.removeItem(STORAGE_KEY);
}

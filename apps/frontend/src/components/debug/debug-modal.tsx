import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import type { generatorFormSchema } from "@/forms/generator-form-schema";
import { DebugTerminalClient } from "./debug-terminal.client";

interface Props {
	debugId: string;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	dataToDebug: z.infer<ReturnType<typeof generatorFormSchema>>;
}

export function DebugModal({ debugId, isOpen, onOpenChange, dataToDebug }: Props) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="flex h-[55vh] w-[65vw] max-w-none flex-col p-00 sm:max-w-none">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle>Debug Terminal</DialogTitle>
				</DialogHeader>

				<div className="flex-1 p-6 pt-4">
					<div className="h-full w-full overflow-hidden rounded-lg border dark:bg-black">
						<DebugTerminalClient sessionId={debugId} dataToDebug={dataToDebug} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

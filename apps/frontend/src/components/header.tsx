import { Package } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { ChangeLanguage } from "./change-language";
import { ToggleTheme } from "./toggle-theme";
import { Button } from "./ui";

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-border border-b bg-card/50 backdrop-blur-sm">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
							<Package className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<h1 className="font-semibold text-foreground text-lg">NestJS Initializr</h1>
							<p className="text-muted-foreground text-xs">Configure your project</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="cursor-pointer">
							<Link href="https://github.com/NedcloarBR/nestjs-initializr" target="_blank" rel="noopener noreferrer">
								<SiGithub className="size-4 dark:text-white" />
							</Link>
						</Button>
						<ToggleTheme />
						<ChangeLanguage />
					</div>
				</div>
			</div>
		</header>
	);
}

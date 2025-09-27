import Image from "next/image";

interface Props {
	name: string;
	iconType: "svg" | "png";
	subfolder?: string;
	className?: string;
}

export function Icon({ name, iconType, subfolder, className }: Props) {
	return (
		<Image
			className={className}
			src={`/icons/${subfolder ? `${subfolder}/` : ""}${name}.${iconType}`}
			alt={`${name} icon`}
			width={32}
			height={32}
		/>
	);
}

import { GeneratorForm } from "@/components/generator-form";
import { Header } from "@/components/header";

// biome-ignore lint/style/noDefaultExport: <>
export default function Index() {
	return (
		<>
			<Header />
			<GeneratorForm />
		</>
	);
}

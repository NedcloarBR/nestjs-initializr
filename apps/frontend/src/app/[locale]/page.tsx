import { GeneratorForm } from "@/components/generator-form";
import { Header } from "@/components/header";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default function Index() {
	return (
		<>
			<Header />

			<GeneratorForm />
		</>
	);
}

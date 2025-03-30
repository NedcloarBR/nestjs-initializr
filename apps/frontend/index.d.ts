declare module "*.svg" {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const content: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	export const ReactComponent: any;
	// biome-ignore lint/style/noDefaultExport: <explanation>
	export default content;
}

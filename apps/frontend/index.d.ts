declare module "*.svg" {
	// biome-ignore lint/suspicious/noExplicitAny: <>
	const content: any;
	// biome-ignore lint/suspicious/noExplicitAny: <>
	export const ReactComponent: any;
	// biome-ignore lint/style/noDefaultExport: <>
	export default content;
}

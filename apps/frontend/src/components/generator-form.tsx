"use client";

import { useNodeVersions } from "@/hooks/useNodeVersions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
	projectName: z.string().min(1, "Project name is required").max(214, "Project name must be less than 214 characters"),
	projectDescription: z.string().optional(),
	nodeVersion: z.string().default("20.0.0").optional(),
	showNodeCurrent: z.boolean().default(false)
});

export function GeneratorForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {}
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	const { nodeVersion } = form.getValues();
	const { versions } = useNodeVersions("v20.0.0", true);

	return (
		<section id="generator-form" className="m-8 h-full bg-zinc-800 rounded-lg">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-xs p-8">
					<h2 className="">Project Metadata</h2>
					<FormField
						control={form.control}
						name="projectName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Project Name</FormLabel>
								<FormControl>
									<Input placeholder="nestjs-project" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="projectDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Project Description</FormLabel>
								<FormControl>
									<Input placeholder="nestjs-project description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="nodeVersion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>NodeJS Version</FormLabel>
								<Select>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Node Version" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{versions.map((version) => (
											<SelectItem key={version.version} value={version.version}>
												{version.version}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="cursor-pointer" type="submit">
						Submit
					</Button>
				</form>
			</Form>
		</section>
	);
}

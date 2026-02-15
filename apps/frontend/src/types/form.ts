// biome-ignore lint/style/useImportType: Used to create the type correctly
import { z } from "zod";
import type { generatorFormSchema } from "@/forms/generator-form-schema";

export type GeneratorFormDataType = z.infer<ReturnType<typeof generatorFormSchema>>;

---
name: new-plugin
description: Scaffold a new generator plugin for nestjs-initializr. Invoke as /new-plugin <name> to create the plugin file with the correct structure.
disable-model-invocation: true
---

Create a new plugin at:
`apps/backend/src/app/modules/generator/plugins/$ARGUMENTS/$ARGUMENTS.plugin.ts`

The file must follow this structure exactly:

```typescript
import { Injectable } from "@nestjs/common";
import { Plugin } from "@/app/common/decorators/plugin.decorator";
import { BasePlugin } from "../../core/base-plugin";
import type { GeneratorContext } from "@/app/common/interfaces/generator-context.interface";
import type { PluginResult } from "@/app/common/interfaces/plugin-result.interface";

@Plugin({
  name: "$ARGUMENTS",
  displayName: "<Human-readable name>",
  description: "<What this plugin adds>",
  priority: 100,
  // dependencies: ["config"],  // uncomment if needed
  // conflicts: [],              // uncomment if needed
})
@Injectable()
export class <PascalCaseName>Plugin extends BasePlugin {
  public async generate(ctx: GeneratorContext): Promise<PluginResult> {
    // Use this.createFile(), this.addDependency(), this.addScript(), etc.
    // Return collected results via this.result()
    return this.result();
  }
}
```

Rules to follow:
- File name and plugin `name` must match: `<name>.plugin.ts` and `@Plugin({ name: "<name>" })`
- The file is auto-discovered by Webpack's `require.context()` at build time — no manual registration needed
- `priority` controls execution order relative to other plugins (higher = runs earlier); `core` is 1000
- Use `this.hasModule("other-plugin-name")` to conditionally adapt output based on user selections
- Use `this.isFastify` / `this.isExpress` to generate adapter-specific code
- Use `this.setState` / `this.getState` to share data with other plugins
- To inject into AppModule, set `constants.import`, `constants.importArray`, `constants.importIn` in the returned PluginResult

After creating the file:
1. Check existing plugins in `apps/backend/src/app/modules/generator/plugins/` for patterns
2. Add the plugin name to `ModuleNames` type if it should appear in the frontend selector
3. Run `yarn nx build backend` to confirm Webpack picks it up without errors

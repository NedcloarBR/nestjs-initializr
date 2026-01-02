# Creating Plugins

This guide explains how to create new plugins for the NestJS Initializr generator system.

## Table of Contents

- [Overview](#overview)
- [Plugin Architecture](#plugin-architecture)
- [Creating a Plugin](#creating-a-plugin)
- [Plugin Options](#plugin-options)
- [BasePlugin API](#baseplugin-api)
- [Context Helpers](#context-helpers)
- [Templates](#templates)
- [Examples](#examples)

---

## Overview

The generator uses a plugin-based architecture inspired by NestJS patterns. Each plugin is responsible for generating specific files, adding dependencies, and configuring the project.

Plugins are:
- **Auto-discovered** using webpack's `require.context`
- **Decorated** with `@Plugin()` for metadata and registration
- **Executed** in priority order during generation

---

## Plugin Architecture

```
plugins/
├── my-plugin/
│   ├── index.ts              # Exports the plugin
│   ├── my-plugin.plugin.ts   # Main plugin class
│   └── templates/
│       ├── index.ts          # Exports templates
│       └── my-plugin.templates.ts  # Template strings
```

---

## Creating a Plugin

### Step 1: Create the plugin folder structure

```bash
mkdir -p apps/backend/src/app/modules/generator/plugins/my-plugin/templates
```

### Step 2: Create the template file

```typescript
// templates/my-plugin.templates.ts

export const myModuleTemplate = {
  name: "my.module.ts",
  path: "src/modules/my-module",
  content: `
import { Module } from "@nestjs/common";
import { MyService } from "./my.service";

@Module({
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
`
};

export const myServiceTemplate = {
  name: "my.service.ts", 
  path: "src/modules/my-module",
  content: `
import { Injectable } from "@nestjs/common";

@Injectable()
export class MyService {
  getHello(): string {
    return "Hello from MyService!";
  }
}
`
};
```

### Step 3: Export templates

```typescript
// templates/index.ts

export * from "./my-plugin.templates";
```

### Step 4: Create the plugin class

```typescript
// my-plugin.plugin.ts

import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { myModuleTemplate, myServiceTemplate } from "./templates";

@Plugin({
  name: "my-plugin",
  displayName: "My Plugin",
  description: "Adds MyModule with custom functionality",
  priority: 400,
  dependencies: ["config"] // Optional: requires config module
})
export class MyPlugin extends BasePlugin {
  // Determines if this plugin should run
  shouldActivate(ctx: GeneratorContext): boolean {
    return ctx.metadata.modules?.includes("my-plugin") ?? false;
  }

  // Main generation logic
  protected onGenerate(): void {
    // Create files
    this.createFile(
      myModuleTemplate.name,
      myModuleTemplate.path,
      myModuleTemplate.content
    );
    
    this.createFile(
      myServiceTemplate.name,
      myServiceTemplate.path,
      myServiceTemplate.content
    );

    // Add dependencies (auto-fetches version from constants)
    this.addPkg("@nestjs/common");
    
    // Or add with explicit version
    this.addDependency("my-package", "^1.0.0");

    // Add dev dependencies
    this.addDevPkg("jest");

    // Add npm scripts
    this.addScript("my-script", "echo 'Hello'");

    // Set constants for other plugins
    this.setConstants({
      token: null,
      import: "MyModule",
      export: 'export { MyModule } from "./my-module/my.module";',
      importArray: "MyModule",
      inject: null,
      importIn: "src/app.module.ts"
    });
  }
}
```

### Step 5: Export the plugin

```typescript
// index.ts

export * from "./my-plugin.plugin";
```

---

## Plugin Options

The `@Plugin()` decorator accepts the following options:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | `string` | ✅ | Unique identifier for the plugin |
| `displayName` | `string` | ✅ | Human-readable name shown in logs |
| `description` | `string` | ❌ | Brief description of what the plugin does |
| `priority` | `number` | ❌ | Execution order (higher = earlier). Default: 0 |
| `dependencies` | `string[]` | ❌ | List of plugin names this plugin depends on |
| `conflicts` | `string[]` | ❌ | List of plugin names that conflict with this plugin |

### Priority Guidelines

| Priority | Use Case |
|----------|----------|
| 1000 | Core plugin (base project files) |
| 900 | Config module |
| 800 | Linter/Formatter |
| 500 | Major modules (GraphQL, etc) |
| 400 | Feature modules (Necord, i18n, etc) |
| 200 | Git hooks (Husky) |
| 100 | Extras, utilities |
| 50 | Test runner |

---

## BasePlugin API

### File Operations

```typescript
// Create a new file
this.createFile(name: string, path: string, content: string): void

// Append content to an existing file
this.appendToFile(filePath: string, fileName: string, content: string): void

// Replace content in an existing file
this.replaceInFile(filePath: string, fileName: string, search: string | RegExp, content: string): void

// Generic file update
this.updateFile(filePath: string, fileName: string, action: "append" | "prepend" | "replace" | "insert-after" | "insert-before", content: string, searchPattern?: string | RegExp): void
```

### Package Operations

```typescript
// Add dependency with auto-version (recommended)
this.addPkg(name: keyof typeof NPM_DEPENDENCIES): void
this.addDevPkg(name: keyof typeof DEV_NPM_DEPENDENCIES): void

// Add dependency with explicit version
this.addDependency(name: string, version: string, dev?: boolean): void
this.addDevDependency(name: string, version: string): void

// Add multiple dependencies
this.addDependencies(packages: Array<{ name: string; version: string; dev?: boolean }>): void
```

### Script Operations

```typescript
// Add npm script to package.json
this.addScript(name: string, command: string): void
```

### Constants Operations

```typescript
// Set module constants for integration with other plugins
this.setConstants(constants: PluginConstants): void
```

---

## Context Helpers

Access project configuration through these getters:

### Module/Extra Checks

```typescript
this.hasModule(name: ModuleNames): boolean    // Check if a module is enabled
this.hasExtra(name: ExtraNames): boolean      // Check if an extra is enabled
this.withConfig: boolean                       // Check if config module is enabled
```

### Project Configuration

```typescript
this.mainType: "fastify" | "express"          // HTTP adapter
this.isFastify: boolean                        // Is using Fastify?
this.isExpress: boolean                        // Is using Express?
this.packageManager: "npm" | "yarn" | "pnpm"  // Package manager
this.linterFormatter: "biome" | "eslint-prettier" | undefined
this.testRunner: "jest" | "vitest" | undefined
this.withDocker: boolean                       // Is Docker enabled?
```

### Package.json Info

```typescript
this.projectName: string        // Project name
this.projectDescription: string // Project description
this.nodeVersion: string        // Node.js version
```

### Shared State (Inter-plugin Communication)

```typescript
this.setState<T>(key: string, value: T): void
this.getState<T>(key: string): T | undefined
this.hasState(key: string): boolean
```

---

## Templates

### Static Templates

```typescript
export const myTemplate = {
  name: "my-file.ts",
  path: "src/modules/my-module",
  content: `
import { Injectable } from "@nestjs/common";

@Injectable()
export class MyService {}
`
};
```

### Dynamic Templates (based on context)

```typescript
export function myTemplate(withConfig: boolean) {
  return {
    name: "my-file.ts",
    path: "src/modules/my-module",
    content: withConfig 
      ? `// With config version`
      : `// Without config version`
  };
}
```

### Template with Replacements

For updating existing files:

```typescript
export const myUpdates = {
  addImport: {
    replacer: 'import { Module } from "@nestjs/common";',
    content: `import { Module } from "@nestjs/common";
import { MyModule } from "./my-module/my.module";`
  }
};

// Usage in plugin
this.replaceInFile(
  "src",
  "app.module.ts",
  myUpdates.addImport.replacer,
  myUpdates.addImport.content
);
```

---

## Examples

### Simple Plugin (creates files only)

```typescript
@Plugin({
  name: "readme",
  displayName: "README Generator",
  priority: 50
})
export class ReadmePlugin extends BasePlugin {
  protected onGenerate(): void {
    this.createFile("README.md", "", `# ${this.projectName}

${this.projectDescription}

## Getting Started

\`\`\`bash
${this.packageManager} install
${this.packageManager} run start:dev
\`\`\`
`);
  }
}
```

### Conditional Plugin (adapts to configuration)

```typescript
@Plugin({
  name: "helmet",
  displayName: "Helmet Security",
  priority: 100
})
export class HelmetPlugin extends BasePlugin {
  shouldActivate(ctx: GeneratorContext): boolean {
    return ctx.metadata.extras?.includes("helmet") ?? false;
  }

  protected onGenerate(): void {
    // Different package based on HTTP adapter
    if (this.isFastify) {
      this.addPkg("@fastify/helmet");
    } else {
      this.addPkg("helmet");
    }

    // Update main.ts
    this.replaceInFile(
      "src",
      "main.ts",
      'import { NestFactory } from "@nestjs/core";',
      `import { NestFactory } from "@nestjs/core";
import helmet from "${this.isFastify ? "@fastify/helmet" : "helmet"}";`
    );
  }
}
```

### Plugin with Dependencies

```typescript
@Plugin({
  name: "necord-pagination",
  displayName: "Necord Pagination",
  priority: 350,
  dependencies: ["necord"] // Requires necord plugin
})
export class NecordPaginationPlugin extends BasePlugin {
  shouldActivate(ctx: GeneratorContext): boolean {
    return ctx.metadata.modules?.includes("necord-pagination") ?? false;
  }

  protected onGenerate(): void {
    // This plugin only runs if "necord" is also active
    this.addPkg("@necord/pagination");
    
    // Update necord module
    this.replaceInFile(
      "src/modules/necord",
      "necord.module.ts",
      "imports: [NecordModule",
      "imports: [NecordPaginationModule, NecordModule"
    );
  }
}
```

---

## Lifecycle Hooks

Plugins can implement optional lifecycle hooks:

```typescript
export class MyPlugin extends BasePlugin {
  // Called before generate (all plugins)
  async beforeGenerate(ctx: GeneratorContext): Promise<void> {
    // Setup, validation, etc.
  }

  // Main generation (required via onGenerate)
  protected onGenerate(): void {
    // Create files, add packages, etc.
  }

  // Called after generate (all plugins)
  async afterGenerate(ctx: GeneratorContext): Promise<void> {
    // Cleanup, final adjustments, etc.
  }
}
```

---

## Adding a New Package to Constants

To use `addPkg()` or `addDevPkg()`, the package must be registered in the constants file:

```typescript
// apps/backend/src/app/constants/packages/npm-packages.ts

export const NPM_DEPENDENCIES = {
  // ... existing packages
  "my-package": {
    name: "my-package",
    version: "^1.0.0"
  }
};

export const DEV_NPM_DEPENDENCIES = {
  // ... existing packages
  "my-dev-package": {
    name: "my-dev-package", 
    version: "^2.0.0"
  }
};
```

---

## Testing Your Plugin

1. Add the plugin to the plugins directory
2. The plugin will be auto-discovered on server restart
3. Check the logs for successful loading:

```
[PluginLoader] 🔍 Discovering plugins...
[PluginLoader]   📦 My Plugin (priority: 400)
[PluginLoader] ✅ Loaded 15 plugin(s) in 25ms
```

4. If your plugin has `shouldActivate`, add the module name to `ModuleNames` type:

```typescript
// apps/backend/src/types/index.d.ts

export type ModuleNames =
  | "config"
  | "my-plugin"  // Add here
  // ...
```

---

## Best Practices

1. **Use meaningful names**: `displayName` should be user-friendly
2. **Set appropriate priority**: Consider dependencies between plugins
3. **Use `addPkg`/`addDevPkg`**: Prefer over manual `addDependency` for version management
4. **Keep templates separate**: Put template strings in the `templates/` folder
5. **Handle both adapters**: Check `isFastify` when packages differ between Express/Fastify
6. **Document your plugin**: Add JSDoc comments explaining what the plugin does

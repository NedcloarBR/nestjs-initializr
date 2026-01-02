# 🔌 Sistema de Plugins para Geração de Templates

Sistema de plugins no estilo NestJS para o NestJS Initializr.

## 🔄 Fluxo de Execução

```
1. Startup: Plugins são auto-descobertos em plugins/**/*.plugin.ts
2. @Plugin decorator registra no registry global
3. Frontend: Usuário seleciona módulos
4. Request: { modules: ["config", "graphql"], ... }
5. Execução: Apenas plugins selecionados são executados
```

**Auto-Descoberta:** O sistema usa glob para encontrar automaticamente todos os arquivos `*.plugin.ts` na pasta `plugins/`. Não é necessário importar manualmente.

## 📁 Estrutura

```
_new-system/
├── common/
│   ├── decorators/
│   │   └── plugin.decorator.ts    # @Plugin com auto-registro
│   ├── interfaces/
│   ├── base-plugin.ts
│   └── index.ts
│
├── core/
│   ├── plugin-container.ts
│   ├── plugin-executor.ts
│   ├── plugin-loader.ts           # Auto-descoberta de plugins
│   └── index.ts
│
├── plugins/                       # Plugins auto-descobertos
│   ├── config/
│   │   └── config.plugin.ts       # Descoberto automaticamente!
│   ├── i18n/
│   │   └── i18n.plugin.ts
│   └── graphql/
│       └── graphql.plugin.ts
│
├── generator.module.ts            # Módulo NestJS
├── plugin-generator.service.ts
└── index.ts
```

## 🔗 Integração com Sistema Existente

O sistema **reutiliza** os recursos existentes:

- `MetadataDTO`, `PackageJsonMetadataDTO` - DTOs
- `NPM_DEPENDENCIES`, `commonPackages` - Constantes de pacotes
- `ConfigTemplates`, `GraphQLTemplates` - Templates existentes

## 🚀 Como Criar um Novo Plugin

### Apenas crie o arquivo `*.plugin.ts`

```typescript
// plugins/meu-plugin/meu.plugin.ts

import { BasePlugin, Plugin } from "../../common";
import type { GeneratorContext } from "../../common/interfaces";
import { MeuTemplates } from "../../../templates/meu";

@Plugin({
  name: "meu-plugin",           // ID usado no metadata.modules
  displayName: "Meu Plugin",
  description: "Descrição do plugin",
  priority: 50,
  dependencies: [],
  conflicts: []
})
export class MeuPlugin extends BasePlugin {

  shouldActivate(ctx: GeneratorContext): boolean {
    return ctx.metadata.modules?.includes("meu-plugin") ?? false;
  }

  protected onGenerate(): void {
    const moduleTemplate = MeuTemplates(this.mainType);
    this.generateFromModuleTemplate(moduleTemplate);
  }
}
```

> **Pronto!** O plugin será descoberto automaticamente e executado quando o usuário selecionar "meu-plugin" no frontend.

## 🔧 API do BasePlugin

### Operações de Arquivo

```typescript
this.createFile(name, path, content)
this.appendToFile(filePath, fileName, content)
this.replaceInFile(filePath, fileName, search, content)
```

### Operações de Pacotes

```typescript
this.addDependency(name, version, dev?)
this.addDevDependency(name, version)
this.addDependencies([{ name, version, dev? }])
```

### Integração com ModuleTemplate

```typescript
this.generateFromModuleTemplate(moduleTemplate)
```

### Helpers de Contexto

```typescript
this.hasModule("config")     // Verifica se módulo está habilitado
this.hasExtra("cors")        // Verifica se extra está habilitado
this.mainType                // "fastify" | "express"
this.isFastify / this.isExpress
this.packageManager          // "npm" | "yarn" | "pnpm"
this.projectName
this.withConfig              // Atalho para hasModule("config")
```

### Comunicação entre Plugins (State)

```typescript
this.setState("chave", valor)
this.getState<Tipo>("chave")
this.hasState("chave")
```

## 🎯 @Plugin Decorator

```typescript
@Plugin({
  name: "meu-plugin",       // Identificador único (auto-registrado)
  displayName: "Meu Plugin",
  description: "...",
  priority: 50,             // Maior = executa primeiro
  dependencies: ["config"], // Plugins requeridos
  conflicts: ["outro"]      // Plugins incompatíveis
})
```

## 🔄 Ciclo de Vida

1. **Registro** - `@Plugin` registra automaticamente no startup
2. **onModuleInit()** - Inicialização do plugin
3. **shouldActivate(ctx)** - Verifica se deve executar
4. **beforeGenerate(ctx)** - Hook pré-geração
5. **generate(ctx)** → **onGenerate()** - Geração principal
6. **afterGenerate(ctx)** - Hook pós-geração

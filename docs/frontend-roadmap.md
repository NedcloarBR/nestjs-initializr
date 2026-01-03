# 🎨 Frontend Roadmap

This document outlines planned features and improvements for the NestJS Initializr frontend.

## 📦 Current Features

- Generator form with metadata, modules, extras
- Light/Dark theme toggle
- Language switcher (en-US, pt-BR)
- Project history (localStorage)
- Extra packages search (NPM registry)
- Configuration export/import
- API status indicator

---

## 🔴 High Priority

Essential improvements for better user experience.

| Feature | Description | Status |
|---------|-------------|--------|
| **Form Validation** | Real-time validation with error messages | 🔄 Partial |
| **Loading States** | Skeleton loaders and progress indicators | ⏳ Planned |
| **Error Handling** | Toast notifications for API errors | ⏳ Planned |
| **Mobile Responsive** | Full mobile support for all components | ⏳ Planned |
| **Keyboard Navigation** | Accessibility improvements (a11y) | ⏳ Planned |
| **Module Dependencies** | Visual indicators when selecting dependent modules | ⏳ Planned |

---

## 🟡 Medium Priority

Features that enhance the overall experience.

| Feature | Description | Status |
|---------|-------------|--------|
| **Preview Mode** | Show generated file tree before download | ⏳ Planned |
| **Code Preview** | Preview generated code snippets | ⏳ Planned |
| **Share Configuration** | Generate shareable URL with config | ⏳ Planned |
| **Presets/Templates** | Quick-start templates (API, Discord Bot, etc.) | ⏳ Planned |
| **Comparison View** | Compare different configurations side-by-side | ⏳ Planned |
| **Onboarding Tour** | First-time user walkthrough | ⏳ Planned |
| **Search Modules** | Filter/search through available modules | ⏳ Planned |

---

## 🟢 Low Priority

Nice to have for specific use cases.

| Feature | Description | Status |
|---------|-------------|--------|
| **PWA Support** | Offline-capable progressive web app | ⏳ Planned |
| **GitHub Integration** | Create repo directly from generator | ⏳ Planned |
| **Analytics Dashboard** | View popular module combinations | ⏳ Planned |
| **Changelog Modal** | Show latest updates and new features | ⏳ Planned |

---

## 🎯 UI/UX Improvements

| Improvement | Description |
|-------------|-------------|
| **Module Cards** | Redesign module selection with icons and descriptions |
| **Grouped Modules** | Organize modules by category (Database, Auth, etc.) |
| **Drag & Drop** | Reorder selected modules |
| **Collapsible Sections** | Better form organization |
| **Step Wizard** | Optional step-by-step configuration mode |
| **Quick Actions** | Floating action buttons for common tasks |

---

## 🌐 Internationalization

| Language | Status |
|----------|--------|
| English (en-US) | ✅ Complete |
| Portuguese (pt-BR) | ✅ Complete |
| Spanish (es) | ⏳ Planned |
| French (fr) | ⏳ Planned |
| German (de) | ⏳ Planned |
| Chinese (zh) | ⏳ Planned |
| Japanese (ja) | ⏳ Planned |

---

## ⚡ Performance

| Optimization | Description |
|--------------|-------------|
| **Bundle Size** | Reduce JavaScript bundle with code splitting |
| **Image Optimization** | Use next/image for all assets |
| **Lazy Loading** | Load modules/components on demand |
| **Caching** | Service worker for static assets |
| **Prefetching** | Prefetch API data on hover |

---

## 🔧 Technical Debt

| Task | Description |
|------|-------------|
| **Component Tests** | Add unit tests with React Testing Library |
| **E2E Tests** | Expand Playwright test coverage |
| **Storybook** | Document components with Storybook |

---

## ⚡ Suggested Implementation Order

```
Phase 1: Core UX
├── Loading states
├── Error handling (toasts)
├── Mobile responsive
└── Module dependencies visual

Phase 2: Enhanced Features
├── Preview mode
├── Presets/templates
├── Share configuration
└── Search modules

Phase 3: Polish
├── Onboarding tour
├── Code preview
├── PWA support
└── Additional languages

Phase 4: Advanced
├── GitHub integration
├── CLI tool
├── Analytics
└── Custom themes
```

---

## 💡 Ideas for Future

| Idea | Description |
|------|-------------|
| **AI Assistant** | Suggest modules based on project description |
| **Marketplace** | Community-created presets and configurations |

---

## 🤝 Contributing

Want to contribute? Check out open issues on GitHub or propose new features.

### Design Guidelines

- Use shadcn/ui components
- Follow Tailwind CSS conventions
- Maintain dark/light theme consistency
- Ensure mobile-first responsive design

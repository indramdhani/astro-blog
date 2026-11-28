---
title: "Micro-Frontends"
publishDate: "2026-11-28"
description: "Splitting a frontend into independently built and deployed parts: module federation, single-spa, iframes and web components."
tags:
  - "architecture"
  - "pattern"
---

## Overview
Decomposing a monolithic frontend into smaller, independent components/modules that can be developed, deployed, and scaled independently.

## Key Enablers
| Enabler | Purpose |
|---------|---------|
| **Micro frontend framework** | Module federation, single-spa, Webpack 5 Module Federation |
| **Robust style guide engine** | Consistent design system across teams |
| **Well-structured routing** | Client-side routing across micro apps |
| **State management** | Shared/global state (Redux, Zustand, Context) |
| **Component reuse** | Shared component library |
| **Asset optimization** | Code splitting, lazy loading, tree shaking |

## Caching Strategy (Multi-Layer)
| Layer | Purpose |
|-------|---------|
| Browser caching | HTTP cache headers, service workers |
| CDN caching | Edge caching for static assets |
| DNS caching | Faster domain resolution |
| Application-level | In-memory, Redis, IndexedDB |

## Project Structure Examples

### Feature-Folder Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── NavBar.jsx
│   │   └── Footer.jsx
│   ├── ui/
│   │   ├── CustomButton.jsx
│   │   ├── CustomCard.jsx
│   │   └── ModalWrapper.jsx
│   ├── forms/
│   │   ├── TextFieldGroup.jsx
│   │   ├── SelectField.jsx
│   │   └── FormActions.jsx
│   ├── dataDisplay/
│   │   ├── UserList.jsx
│   │   ├── ProductCardGrid.jsx
│   │   └── ChartWrapper.jsx
│   └── navigation/
│       ├── Breadcrumbs.jsx
│       ├── DrawerMenu.jsx
│       └── TabsPanel.jsx
├── templates/
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── ContactPage.jsx
│   ├── DashboardPage.jsx
│   └── ProfilePage.jsx
```

### Page-Centric Structure
```
src/
├── components/
│   ├── shared/
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomButton.jsx
│   │   ├── CustomCard.jsx
│   │   └── ModalWrapper.jsx
│   ├── HomePage/
│   │   ├── HomePage.jsx
│   │   └── HomeFeature.jsx
│   ├── AboutPage/
│   │   ├── AboutPage.jsx
│   │   └── TeamMembers.jsx
│   ├── ContactPage/
│   │   ├── ContactPage.jsx
│   │   └── ContactForm.jsx
│   └── Dashboard/
│       ├── DashboardPage.jsx
│       ├── DashboardWidget.jsx
│       └── StatsCard.jsx
├── App.jsx
└── index.js
```

## Integration Approaches
| Approach | Description | Trade-off |
|----------|-------------|-----------|
| **Build-time (Module Federation)** | Webpack 5 MF, shared at compile time | Tight coupling, version sync needed |
| **Runtime (single-spa)** | Each micro-app mounted at route | Independent deploy, runtime overhead |
| **Iframes** | Complete isolation | Poor UX, SEO, communication complexity |
| **Web Components** | Custom elements as integration points | Framework agnostic, shadow DOM limits |

## Related

- [Backend for Frontend (BFF)](/posts/backend-for-frontend/) — The matching pattern on the backend side

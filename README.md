# clipboard

Source of [indramdhani.net](https://indramdhani.net), a personal blog built with [Astro](https://astro.build), Tailwind CSS and Markdown/MDX. It started from the [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) theme.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm ci`          | Install dependencies                    |
| `npm run dev`     | Start the dev server (drafts are shown) |
| `npm run build`   | Build the static site to `./dist`       |
| `npm run preview` | Preview the production build            |
| `npm run check`   | Type-check Astro/TypeScript files       |
| `npm run lint`    | Run ESLint                              |
| `npm run format`  | Format `./src` with Prettier            |

CI (`.github/workflows/ci.yml`) runs lint, check and build on every pull request. Builds work offline: the OG image fonts come from `@fontsource/roboto-mono`.

## Writing a post

Create `src/content/post/<slug>/index.md`; images go in `<slug>/images/` and are referenced with `![alt](./images/file.jpg)` so Astro optimises them.

```md
---
title: "Max 60 characters"
description: "10-160 characters, used for SEO and previews"
publishDate: "2026-01-31" # ISO date
updatedDate: "2026-02-10" # optional
tags: ["docker", "docker-series"] # tags ending in -series show up on /collections
lang: "en" # or "id" for posts in Bahasa Indonesia
draft: true # optional, drafts are only visible in `npm run dev`
---
```

## Site configuration

Site title, author, description, language and social handles live in `src/site.config.ts`; navigation links in `src/data/constants.ts`.

## License

MIT, see [LICENSE](./LICENSE).

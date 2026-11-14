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

### Scheduling posts

Set `publishDate` to a future date and merge the post early: until that date it is left out of the site, RSS, sitemap and search (`npm run dev` still shows it). A daily workflow (`.github/workflows/scheduled-build.yml`, 00:30 UTC) triggers a Netlify build, so the post goes live on its date. This needs a Netlify build hook saved as the GitHub secret `NETLIFY_BUILD_HOOK`. Run the workflow manually from the Actions tab to publish sooner. Netlify deploy previews build future posts too (`INCLUDE_FUTURE_POSTS=true`), so you can review them in the pull request.

## Site configuration

Site title, author, description, language and social handles live in `src/site.config.ts`; navigation links in `src/data/constants.ts`.

## License

MIT, see [LICENSE](./LICENSE).

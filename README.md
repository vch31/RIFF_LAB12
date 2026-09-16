# RIFF LAB — сайт студии (React + Vite)

Стандартный одностраничный React-проект (Vite + TypeScript + Tailwind CSS v4),
собранный из исходного проекта Higgsfield-платформы. Все зависимости платформы
(Higgsfield SDK, TanStack Start/Server) удалены и заменены локальными
реализациями — проект полностью автономен.

## Быстрый старт

```bash
npm install     # или bun install — обе команды работают
npm run dev     # локальный dev-сервер (http://localhost:5173)
npm run build   # typecheck + production-сборка в dist/
npm run preview # предпросмотр собранного dist/
```

Требования: Node.js 20+ (npm) или bun.

## Структура

```
src/
  main.tsx        — точка входа, монтирует приложение в #root
  App.tsx         — маршрутизация (react-router), <title>, 404, error boundary
  styles.css      — Tailwind вход + импорт локальных токенов
  pages/
    Landing.tsx   — главная страница (лендинг студии, `/`)
    Studio.tsx    — внутренний раздел `/app` (демонстрационный shell)
  layouts/
    custom.tsx    — та самая «студийная» оболочка (навигация, генерации, настройки)
  components/     — UI-компоненты приложения (gallery, generation-card, prompt-box,
                    custom-ui, ui/* — shadcn-подобный набор и т.д.)
  sdk/            — ЛОКАЛЬНЫЕ ЗАГЛУШКИ вместо Higgsfield SDK
    quanta/       — компоненты-замены `@higgsfield/quanta/*` (Button, Modal,
                    Typography, Media, Sidebar, ...)
    fnf/          — типы данных генераций и хелперы (`Generation`, `JobPhase`, ...)
    quanta-shim.css — дизайн-токены (--hf-*) и утилиты q-* (генерируется)
  lib/            — утилиты (cn, download-media, higgsfield-generation-results)
```

Ключевое отличие от оригинала: модули `src/sdk/*` — это написанные с нуля
заглушки с тем же интерфейсом, что у старых пакетов `@higgsfield/quanta` и
`@higgsfield/fnf`. Код компонентов не менялся — изменились только импорты.

## Что было удалено при миграции (по сравнению с платформенным исходником)

- пакеты `@higgsfield/*` (quanta, fnf, app-landing) и `@tanstack/*`
  (react-router, react-start, react-query, router-cli), `nitro`, Cloudflare-слой;
- SSR-обвязка (`start.ts`, `server.ts`, маршруты файловых роутов TanStack,
  robots/sitemap как server-routes);
- служебные модули платформы (design-inspector, error-reporting, example.functions,
  bindings/config/security-headers серверные файлы, миграции D1);
- добавлены: `react-router-dom`, `index.html`, `src/main.tsx`, `public/robots.txt`,
  `public/sitemap.xml`, демо-видео галереи в `public/gallery/`.

## Дизайн-токены

CSS-токены (цвета, радиусы, тени, типографика, `q-*` утилиты) определены в
`src/sdk/quanta-shim.css`. Это собственный тёмный theme-набор проекта — шестых
значений платформы там нет. Файл генерируется скриптом и собирается из того,
что реально используется в `src/`:

```bash
node tools/gen-quanta-shim.mjs .   # перегенерировать src/sdk/quanta-shim.css
```

## Маршруты

| Путь    | Что открывается                        |
| ------- | -------------------------------------- |
| `/`     | Лендинг студии (гитара / барабаны)     |
| `/app`  | Демо-оболочка студии (`?preview=1` — inert-режим) |
| любой   | 404                                    |
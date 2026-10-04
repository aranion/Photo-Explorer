# Photo Explorer

Учебно-демонстрационное приложение на Vite + React + TypeScript:

- загружает JSON с сервера (5000 записей) и показывает прогресс в процентах;
- позволяет отменить загрузку на любом этапе;
- отображает данные в виртуализированной таблице (TanStack Table + TanStack Virtual);
- ищет по таблице без кнопки «Найти» (debounce) и подсвечивает запрос в найденных строках;
- содержит две страницы с разными стратегиями поиска для сравнения подходов.

## Стек

| Слой | Технологии |
| --- | --- |
| Сборка | Vite 8, TypeScript 6 (strict) |
| UI | React 19, CSS Modules (без UI-библиотек) |
| Таблица | @tanstack/react-table 8, @tanstack/react-virtual 3 |
| Роутинг | react-router-dom 7 |
| Сеть | нативный `fetch` + `ReadableStream` + `AbortController` |
| Тесты | Vitest |
| Качество | ESLint (flat config), @stylistic, границы слоёв |
| Инфраструктура | Docker, docker compose, GitHub Actions |

## Быстрый старт

Требуется Node.js 22+ (см. `.nvmrc`).

```bash
npm install
npm run dev
```

Приложение: http://localhost:5173

## Запуск в Docker

```bash
docker compose up --build
```

Dev-сервер с HMR поднимется на http://localhost:5173 (healthcheck — на `127.0.0.1`).
Для актуальных данных в томе используется polling (`CHOKIDAR_USEPOLLING=true`),
что важно при запуске на Windows/macOS.

Остановить: `docker compose down`.

Если npm в контейнере стоит за корпоративным TLS-прокси, сборку можно параметризовать:

```bash
NPM_REGISTRY=https://registry.npmjs.org/ NPM_STRICT_SSL=true docker compose up --build
```

(`NPM_STRICT_SSL=false` — значение по умолчанию для dev-контейнера, где проверка
сертификата может мешать за прокси.)

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | dev-сервер Vite |
| `npm run build` | типовая проверка (`tsc -b`) и production-сборка |
| `npm run preview` | предпросмотр production-сборки |
| `npm run lint` | проверка ESLint |
| `npm run lint:fix` | ESLint с автоисправлением |
| `npm run test` | unit-тесты Vitest (одноразовый прогон) |
| `npm run test:watch` | тесты в watch-режиме |

## Переменные окружения

Базовый URL API задаётся переменной `VITE_API_BASE_URL` (см. `.env.example`).
Если переменная не задана, используется `DEFAULT_API_BASE_URL` из `src/app/constants`.

```bash
cp .env.example .env.local
```

## Архитектура

```
src/
  app/                          # прикладной слой
    components/
      common/                   # переиспользуемые презентационные компоненты
        Button/                 # настраиваемая кнопка (primary/secondary/danger/ghost)
        DownloadPanel/          # панель загрузки (+ вложенный DownloadStatusContent/)
        ErrorBoundary/          # граница ошибок рендера
        HighlightedText/        # подсветка поискового запроса
        ProgressBar/            # индикатор прогресса
        SearchInput/            # нативный input type="search"
        VirtualizedTable/       # generic-таблица: сортировка + виртуализация
      PhotoSearchPage/          # общий каркас страницы: шапка, панель загрузки, поиск
      PhotoTable/               # доменные модули таблицы: колонки, константы, тексты
    pages/                      # страницы приложения: различаются только стратегией поиска
      TanStackSearchPage/       # поиск средствами TanStack Table
      CustomSearchPage/         # поиск собственными средствами
    providers/
      PhotoDataProvider/        # общий стейт загрузки для страниц (context + reducer)
    constants/                  # глобальные константы, разнесены по логике
                                # api.ts, search.ts, routes.ts
    App.tsx / main.tsx
  api/                          # транспорт: fetchJsonWithProgress, ApiError → HttpError/CancelledError
  hooks/                        # переиспользуемые хуки (useDebouncedValue)
  lib/                          # чистые функции с JSDoc: reducer, поиск, подсветка
  types/                        # общие типы (Photo, DownloadState)
  styles/                       # глобальные классы и CSS-токены верхнего уровня
tests/                          # тесты, повторяют структуру путей src
  lib/                          # src/lib/highlightText.ts → tests/lib/highlightText.test.ts
```

### Правила и конвенции

- **Компонент = папка.** Файл компонента — `index.tsx` (имя папки не дублируется),
  пропсы — в `types.ts` рядом, локальные нетекстовые константы — в `const.ts` рядом,
  стили — в `styles.module.css`. Тексты пишутся прямо в разметке, без строковых констант.
  Один файл — один компонент; если внутри компонента нужен собственный компонент, он
  выносится в подпапку рядом (`DownloadPanel/DownloadStatusContent/`). Вспомогательные
  функции, которые используются только внутри компонента, объявляются внутри этого
  компонента, а не на уровне модуля.
- **Типы.** Общие типы живут в `src/types`, локальные — рядом с компонентом.
- **Общие компоненты** выносятся в `common`; доменные (колонки фотографий) — в `PhotoTable`.
  Кнопки во всём приложении используют один настраиваемый `Button`
  (`primary`, `secondary`, `danger`, `ghost`) — стили кнопок живут только там.
- **Общий каркас страницы** вынесен в доменный `PhotoSearchPage`: шапка, панель загрузки
  и поле поиска определены в одном месте. Страницы передают только заголовок, состояние
  поиска и таблицу, поэтому не дублируют разметку и стили.
- **Глобальные стили** (токены, сброс, фокус) лежат на верхнем уровне в `src/styles/global.css`,
  а не внутри слоя `app`.
- **Ошибки API** образуют иерархию `ApiError → HttpError / CancelledError`, поэтому отмена
  определяется через `instanceof CancelledError`, а не по строковому имени ошибки.
- **Глобальные константы** — в `app/constants`, разнесены по логике в отдельные файлы
  (`api.ts`, `search.ts`, `routes.ts`); локальные нетекстовые — в `const.ts` у места
  использования. Строковые тексты интерфейса пишутся прямо в разметке.
- **Barrel-файлов нет**: страница импортирует компоненты напрямую (`@/app/components/...`),
  что упрощает tree-shaking и HMR.
- **Стиль кода**: без точек с запятой (`@stylistic/semi: never`), одинарные кавычки.
- **Функции**: не-стрелочные объявляются как `const fn = function() { ... }`.
- **JSDoc** обязателен для экспортов слоя `lib` (назначение, параметры, результат).
- **Версии пакетов зафиксированы** точно, без `^`; в `.npmrc` включён `save-exact=true`.
- **Тесты** живут в `tests/` и повторяют пути `src/`
  (`src/lib/x.ts` → `tests/lib/x.test.ts`), чтобы файл теста легко находился по пути.
- **Alias**: `@/* → src/*`, глубокие относительные импорты запрещены правилом ESLint.
- **Границы слоёв проверяет ESLint** (`no-restricted-imports`):
  - `lib` — чистые функции без React и без зависимостей от `app/api/hooks`;
  - `api` и `types` не зависят от UI, хуков и прикладной логики;
  - `common`-компоненты презентационные: без `api`, `hooks`, `providers`, `pages`.

### Загрузка данных

`fetchJsonWithProgress` читает ответ через `ReadableStream`, считает полученные байты и
отдаёт процент через колбэк. Общий размер берётся из `Content-Length`; если сервер его
не прислал (например, chunked-ответ за прокси), используется оценка
`ESTIMATED_PHOTOS_RESPONSE_BYTES`, чтобы проценты всё равно отображались. Отмена
реализована через `AbortController`, а номер запроса (`requestId`) защищает от гонок:
результат устаревшего запроса игнорируется. Состояние загрузки — discriminated union
(`idle | loading | success | cancelled | failure`) в `downloadReducer`.

### Поиск: две реализации на одной кодовой базе

| | `/tanstack-search` | `/custom-search` |
| --- | --- | --- |
| Механизм | `getFilteredRowModel` + `globalFilterFn` | `filterByQuery` до передачи в таблицу |
| Поля поиска | колонки с `meta.searchable` | `getPhotoSearchableValues` |
| Счётчик | через `onVisibleRowCountChange` таблицы | `filteredPhotos.length` |
| Плюсы | декларативно, меньше кода | полный контроль, прозрачная чистая функция |
| Общее | debounce 300 мс, `HighlightedText`, `matchesAnyQuery` | то же |

Обе стратегии используют общий примитив `matchesAnyQuery`, поэтому ведут себя одинаково
при одинаковом вводе. Переключение страниц не сбрасывает загруженные данные —
состояние живёт в `PhotoDataProvider`.

## Тесты

```bash
npm run test
```

Тесты лежат в `tests/` зеркально структуре `src/`, например
`tests/lib/highlightText.test.ts` для `src/lib/highlightText.ts`. Покрыты чистые
модули: `highlightText`, `matchesAnyQuery`, `filterByQuery`,
`createSearchableColumnsFilter` (на фейковых строках TanStack), `downloadReducer`
(все переходы состояний) и иерархия ошибок API (`tests/api/errors.test.ts`).
Итого 29 тестов.

## Проверка работоспособности

1. Откройте http://localhost:5173 — откроется страница `/tanstack-search`.
2. Нажмите **«Загрузить данные»**: виден процент, объём и кнопка **«Отменить загрузку»**.
3. Во время загрузки нажмите отмену — статус «Загрузка отменена», кнопка «Повторить загрузку».
4. Загрузите данные: в таблице 5000 записей, в DOM одновременно ~15–25 строк (виртуализация).
5. Введите `sunt qui`: через 300 мс после окончания ввода таблица отфильтруется,
   совпадения подсветятся жёлтым, появится счётчик «Найдено: N из 5000».
6. Кликните по заголовку «Название» — сортировка; повторный клик меняет направление.
7. Переключитесь на «Собственный поиск» — данные уже загружены, поиск работает так же.
8. `npm run lint`, `npm run test`, `npm run build` — все проверки без ошибок.

## Известные ограничения

- Если сервер не отдаёт `Content-Length`, проценты считаются от оценки
  `ESTIMATED_PHOTOS_RESPONSE_BYTES`, поэтому носят приблизительный характер.
- При gzip-сжатии `Content-Length` указывает сжатый размер, поэтому процент
  ограничивается значением 100 (clamp).
- Данные `jsonplaceholder.typicode.com/photos` — тестовые, ссылки на изображения
  могут быть недоступны.

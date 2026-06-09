# Fullstack Authorization

Fullstack-проект авторизации с backend на NestJS и frontend на Next.js. Проект демонстрирует регистрацию, вход по email/password, подтверждение почты, сброс пароля, двухфакторную авторизацию, OAuth-провайдеры, управление профилем, смену email/password и загрузку аватара.

## Стек

**Backend:** NestJS, Express Sessions, Prisma 7, PostgreSQL, Redis, MinIO, class-validator, Argon2, Nodemailer, React Email, Google reCAPTCHA, OAuth Google/GitHub.

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zod, React Hook Form, TanStack Query, shadcn/radix-ui, Sonner.

**Инфраструктура:** PostgreSQL для данных, Redis для session store и временных токенов смены email, MinIO для аватаров.

## Возможности

- Регистрация и вход по email/password.
- Подтверждение email через одноразовый токен.
- Сброс пароля по email.
- Двухфакторная авторизация через email-код.
- OAuth-вход через Google и GitHub.
- Привязка и отвязка OAuth-провайдеров в профиле.
- Добавление пароля для OAuth-аккаунта.
- Просмотр и обновление профиля.
- Смена email с callback-ссылкой и кодом подтверждения.
- Смена пароля с завершением текущей сессии.
- Загрузка, обработка и удаление аватара через MinIO.
- Защита dashboard/auth маршрутов на клиенте через Next middleware.
- Rate limiting на чувствительных backend endpoints.

## Структура

```text
.
├── client/    # Next.js frontend
└── server/    # NestJS backend, Prisma, docker-compose
```

## Требования

- Node.js 22+
- pnpm 11+
- Docker и Docker Compose
- SMTP-доступ для отправки писем
- OAuth credentials для Google/GitHub
- Google reCAPTCHA ключи

## Переменные окружения

В проекте используются отдельные `.env` файлы для backend и frontend.

### `server/.env`

```env
NODE_ENV=development
BASE_URL=http://localhost:4000
APPLICATION_PORT=4000
APPLICATION_URL=http://localhost:4000
ALLOWED_ORIGIN=http://localhost:3000

COOKIES_SECRET=change-me
SESSION_SECRET=change-me
SESSION_NAME=session
SESSION_DOMAIN=localhost
SESSION_MAX_AGE=30d
SESSION_HTTP_ONLY=true
SESSION_SECURE=false
SESSION_FOLDER=session:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=auth
POSTGRES_URI=postgresql://postgres:postgres@localhost:5433/auth

REDIS_USER=default
REDIS_PASSWORD=redis-password
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_URI=redis://default:redis-password@localhost:6380

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_LOGIN=user@example.com
MAIL_PASSWORD=password
MAIL_FROM=user@example.com

GOOGLE_RECAPTCHA_SECRET_KEY=secret

GOOGLE_CLIENT_ID=google-client-id
GOOGLE_CLIENT_SECRET=google-client-secret
GITHUB_CLIENT_ID=github-client-id
GITHUB_SECRET_ID=github-client-secret

TELEGRAM_BOT_SECRET=telegram-bot-secret
TELEGRAM_BOT_PUBLIC=telegram-bot-public
TELEGRAM_AUTH_URI=https://oauth.telegram.org/auth

MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio-password
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET_AVATARS=avatars
MINIO_REGION=us-east-1
```

### `client/.env`

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_RECAPTCHA_PUBLIC_KEY=public-key
```

Важно: `SESSION_NAME` на backend должен совпадать с cookie, которую проверяет frontend middleware. Сейчас frontend ожидает cookie `session`.

## Запуск

### 1. Backend infrastructure

```bash
cd server
docker compose up -d
```

Docker поднимает:

- PostgreSQL: `localhost:5433`
- Redis: `localhost:6380`
- MinIO API: `localhost:9000`
- MinIO Console: `localhost:9001`

### 2. Backend dependencies и база

```bash
cd server
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm run start:dev
```

Backend будет доступен на `APPLICATION_PORT`, например `http://localhost:4000`.

### 3. Frontend

```bash
cd client
pnpm install
pnpm run dev
```

Frontend по умолчанию будет доступен на `http://localhost:3000`.

## OAuth redirect URLs

Для локального запуска у провайдеров должны быть callback URL:

```text
http://localhost:4000/auth/oauth/callback/google
http://localhost:4000/auth/oauth/link/callback/google
http://localhost:4000/auth/oauth/callback/github
http://localhost:4000/auth/oauth/link/callback/github
```

Если `BASE_URL` отличается, callback URLs нужно обновить соответственно.

## Основные команды

### Backend

```bash
cd server
pnpm run start:dev
pnpm run build
pnpm run lint
pnpm run test
pnpm prisma generate
pnpm prisma migrate dev
```

### Frontend

```bash
cd client
pnpm run dev
pnpm run build
pnpm run lint
```

## Проверка состояния

На текущем состоянии проекта проходят:

```bash
cd server && pnpm run build
cd server && pnpm run lint
cd client && pnpm run build
cd client && pnpm run lint
```

`cd server && pnpm run test` сейчас завершается с `No tests found`, потому что в проекте пока нет `*.spec.ts` тестов.

## Замечания к развитию

- Next.js 16 предупреждает, что convention `middleware.ts` deprecated и его стоит мигрировать на `proxy.ts`.
- Для GitHub OAuth приватный email может приходить как `null`; для production-сценария лучше дополнительно читать `/user/emails`.
- Для production нужно включать `SESSION_SECURE=true`, использовать HTTPS и узкий `ALLOWED_ORIGIN`.
- Желательно добавить unit/e2e тесты для auth, session, token и email flows.

# books-api

## Getting started

### Install dependencies

```sh
yarn install
```

### Start insfrastructure dependencies using docker compose.

> **_NOTE:_** Included dependencies:
> - Postgresql
> - Redis

```sh
docker compose up
```

### Start application

```sh
yarn dev
```


### Access swagger docs

[`https://127.0.0.1:3000/docs`](https://127.0.0.1:3000/docs)

---

## Tech Stack
- [`Koa`](https://github.com/koajs/koa)
- [`koa-router`](https://github.com/ZijianHe/koa-router) for routing
- [`Zod`](https://github.com/colinhacks/zod) for validation
- [`objection + knex`](https://github.com/vincit/objection.js) as database URM
- [`pino-http`](https://github.com/pinojs/pino-http) for logging
- [`jest`](https://github.com/facebook/jest) and [`supertest`](https://github.com/ladjs/supertest) for E2E testing
- [`esbuild`](https://github.com/evanw/esbuild) as ts to js bundler.

## Project Info

Project starting point is `src/app.ts`.

Project enviroment variables are located in `.enc.local`.
> `.env` file is removed from `.gitignore` for presentation purposes.

Enviroment variables validator and parser is in `src/app.env.ts`.

Database configuration is in `src/db` directoriry. It contains:
- `migrations`
- `seeds`
- `models`

Application modules are located in `src/modules` directory.
Each module contains minimum:
- `router`
- `controller`
- `server`
- `spec`
- `schema` [optional]
- any other code needed for specific module.

Swagger configuration and runner is located in `src/utils/router.swagger.ts`

---

## Testing

All E2E testing specifications are located in `*.spec.ts` files in associated modules directory.

#### Run test
```sh
yarn test
```

import Router from 'koa-router';
import { HealthRouter } from './modules/health/health.router';
import { RouterSwagger } from './utils/router.swagger';
import { AuthRouter } from '@App/modules/auth/auth.router';
import { BooksRouter } from '@App/modules/books/books.router';
import { BookContentRouter } from '@App/modules/bookcontent/bookcontent.router';
import KoaRatelimit from 'koa-ratelimit';
import { redisClient } from './utils/redis.client';

const router = new Router();
const apiRouter = new Router();

apiRouter.use(
  KoaRatelimit({
    driver: 'redis',
    db: redisClient,
    duration: 60 * 1000,
    max: 100,
    throw: true,
  }),
);
apiRouter.use(AuthRouter.middleware());
apiRouter.use(BooksRouter.middleware());
apiRouter.use(BookContentRouter.middleware());

router.use(HealthRouter.middleware());
router.get('/docs', RouterSwagger(apiRouter));

export { router as AppRoutes, apiRouter as ApiRoutes };

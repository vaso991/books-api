import Router from 'koa-router';
import { KoaRouterSwagger } from 'koa-router-zod-swagger';

/**
 * Initialize swagger server.
 * @param router Api koa-router object
 */
export const RouterSwagger = (router: Router) => {
  return KoaRouterSwagger(router, {
    routePrefix: false,
    title: 'Books Api',
    swaggerOptions: {
      spec: {
        info: {
          version: '1.0.0',
          description: 'Books api specs',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  });
};

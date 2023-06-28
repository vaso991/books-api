import { RouterContext } from 'koa-router';

/**
 * Declaration for application state object.
 * Use this as context type in controllers.
 */
export type AppState = {
  user: {
    email: string;
    id: string;
    jwt?: string;
  };
};

export type AppContext = RouterContext<AppState>;

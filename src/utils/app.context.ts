import { RouterContext } from 'koa-router';

export type AppState = {
  user: {
    email: string;
    id: string;
    jwt?: string;
  };
};

export type AppContext = RouterContext<AppState>;

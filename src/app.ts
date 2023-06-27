import 'reflect-metadata';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import { AppRoutes, ApiRoutes } from './routes';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { Db } from './db';
import { AppEnv } from '@/app.env';
import { StatusCodes } from 'http-status-codes';

export class App {
  private readonly koaApp: Koa;

  constructor() {
    this.koaApp = new Koa();
  }

  public getKoaApp() {
    return this.koaApp;
  }

  public static async init() {
    const app = new App();
    await Db.init();
    app.initializeMiddlewares();
    app.initializeRoutes();
    app.initializeProcessExitLiteners();
    return app;
  }

  private initializeMiddlewares() {
    this.koaApp.keys = [AppEnv.COOKIE_KEY];
    this.koaApp.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        dnsPrefetchControl: false,
      }),
    );
    this.koaApp.use(
      cors({
        credentials: true,
      }),
    );
    this.koaApp.use(koaBody());
    this.koaApp.use(ErrorMiddleware());
    this.koaApp.use(LoggerMiddleware());
  }

  private initializeRoutes() {
    this.koaApp.use(AppRoutes.allowedMethods()).use(AppRoutes.middleware());
    this.koaApp.use(ApiRoutes.allowedMethods()).use(ApiRoutes.middleware());
    this.koaApp.use((ctx) => ctx.throw(StatusCodes.NOT_FOUND));
  }

  public exit() {
    console.log('Closing...');
    this.closeDbConnection();
    process.exit(1);
  }

  public closeDbConnection() {
    void Db.destroy();
  }

  private initializeProcessExitLiteners() {
    process.on('SIGINT', this.exit.bind(this));
    process.on('SIGTERM', this.exit.bind(this));
  }

  public start() {
    return this.koaApp.listen(AppEnv.PORT, () => {
      console.log(`Server started on port http://127.0.0.1:${AppEnv.PORT}`);
      console.log(`Docs started on port http://127.0.0.1:${AppEnv.PORT}/docs`);
    });
  }
}

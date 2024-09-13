import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  Provider,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PagesModule } from './pages/pages.module';
import { size } from './config/cache';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from './common/exception.filter';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { BacksupportLocaleMiddleware } from './common/middlewares/backsupport-locale.middleware';

const exceptionProvider: Provider = {
  provide: APP_FILTER,
  useClass: ExceptionFilter,
};

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, max: size }),
    PostsModule,
    UsersModule,
    CategoriesModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, exceptionProvider],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(BacksupportLocaleMiddleware).forRoutes('*');
  }
}

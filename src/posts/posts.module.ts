import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';
import { UsersModule } from '../users/users.module';
import { WebStoriesController } from './web-stories.controller';
import { CheckRedirectionMiddleware } from '../common/middlewares/check-redirection.middleware';
import { PostmetaService } from './postmeta.service';
import { CacheService } from '../common/services/cache.service';

@Module({
  imports: [UsersModule],
  providers: [
    CommentsService,
    LikesService,
    PostsService,
    SharesService,
    PostmetaService,
    CacheService,
  ],
  controllers: [
    CommentsController,
    LikesController,
    PostsController,
    SharesController,
    WebStoriesController,
  ],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRedirectionMiddleware)
      .forRoutes({ path: '/v1/posts/:slug', method: RequestMethod.GET });
  }
}

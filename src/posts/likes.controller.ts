import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Auth, AuthUser } from 'src/common/decorators/auth.decorator';
import { Post as PostModel } from './models/post.model';
import { User } from 'src/users/models/user.model';
import { CreateLikeDto } from './dto/likes.dto';
import { LikesService } from './likes.service';

@Controller('posts/:slug/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Auth({ required: false })
  @Get()
  async get(@Param('slug') postSlug: string, @AuthUser() user?: User) {
    const post = await PostModel.query()
      .modify('published')
      .findOne({ post_name: postSlug })
      .throwIfNotFound();

    const [count, hasLiked] = await Promise.all([
      this.likesService.count(post.id),
      (() => {
        if (!user) return false;
        return this.likesService.has(post.id, user);
      })(),
    ]);

    return {
      count,
      hasLiked,
    };
  }

  @Auth()
  @Post()
  async add(
    @Param('slug') postSlug: string,
    @AuthUser() user: User,
    @Body() data: CreateLikeDto,
  ) {
    const post = await PostModel.query()
      .modify('published')
      .findOne({ post_name: postSlug })
      .throwIfNotFound();
    await this.likesService.add(post.id, user, data);

    return {
      message: 'The post has been liked.',
    };
  }

  @Auth()
  @Delete()
  async remove(@Param('slug') postSlug: string, @AuthUser() user: User) {
    const post = await PostModel.query()
      .modify('published')
      .findOne({ post_name: postSlug })
      .throwIfNotFound();
    await this.likesService.remove(post.id, user);

    return {
      message: 'The post has been disliked.',
    };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth, AuthUser } from 'src/common/decorators/auth.decorator';
import { paginate } from 'src/common/helpers/query.helper';
import { Comment } from './models/comment.model';
import { CommentsService } from './comments.service';
import { Post as PostModel } from './models/post.model';
import { User } from 'src/users/models/user.model';
import { CreateCommentDto } from './dto/comments.dto';

@Controller('posts/:slug/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async get(
    @Param('slug') postSlug: string,
    @Query() query: Record<string, string>,
  ) {
    const post = await PostModel.query()
      .modify('published')
      .findOne({ post_name: postSlug })
      .throwIfNotFound();
    return await paginate(
      query,
      Comment.query()
        .where('comment_post_ID', post.id)
        .where('comment_approved', 1)
        .orderBy('comment_ID', 'desc'),
    );
  }

  @Auth()
  @Post()
  async add(
    @AuthUser() user: User,
    @Param('slug') postSlug: string,
    @Body() data: CreateCommentDto,
  ) {
    const post = await PostModel.query()
      .modify('published')
      .findOne({ post_name: postSlug })
      .throwIfNotFound();
    return this.commentsService.add(post.id, data, user);
  }

  @Auth()
  @Delete(':commentId')
  async remove(@AuthUser() user: User, @Param('commentId') commentId: number) {
    const comment = await Comment.query().findById(commentId).throwIfNotFound();

    if (comment.user_id !== user.id)
      throw new UnauthorizedException(
        "You're not authorized to delete this comment.",
      );

    await Comment.query()
      .where('comment_ID', commentId)
      .update({ comment_approved: 'trash' });

    return {
      message: 'The comment has been deleted.',
    };
  }
}

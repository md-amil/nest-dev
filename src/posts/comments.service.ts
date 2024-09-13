import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/comments.dto';
import { Comment } from './models/comment.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class CommentsService {
  async add(postId: number, data: CreateCommentDto, user: User) {
    return Comment.query().insertAndFetch({
      author_name: user.name,
      content: data.content,
      parent_id: data.parent_id ?? 0,
      comment_post_ID: postId,
      comment_karma: 0,
      comment_approved: 1,
      comment_type: 'comment',
      user_id: user.id,
      created_at: new Date(),
      comment_date_gmt: new Date(),
    });
  }
}

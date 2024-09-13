import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { CreateLikeDto } from './dto/likes.dto';
import { Like } from './models/like.model';

@Injectable()
export class LikesService {
  async count(postId: number): Promise<number> {
    const response = await Like.query().where({ post_id: postId }).count();
    return response[0]['count(*)'];
  }

  async add(postId: number, user: User, data: CreateLikeDto) {
    if (await this.has(postId, user)) return;

    return Like.query().insert({
      post_id: postId,
      user_id: user.id,
      date_time: new Date(),
      value: 1,
      ip: data.ip,
    });
  }

  async has(postId: number, user?: User) {
    if (!user) return false;

    const response = await Like.query()
      .where({ post_id: postId, user_id: user.id })
      .first();

    return !!response;
  }

  async remove(postId: number, user: User) {
    await Like.query().where({ post_id: postId, user_id: user.id }).delete();
  }
}

import { IsIP } from 'class-validator';

export class CreateLikeDto {
  @IsIP()
  ip: string;
}

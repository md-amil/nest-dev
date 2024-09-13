import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';

interface FromRequestOptions {
  masterPhrId: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  async createFromRequest(authHeader: FromRequestOptions) {
    const user_registered = new Date();
    return User.query().insertGraphAndFetch({
      username: authHeader.mobileNumber,
      name: `${authHeader.firstName} ${authHeader.lastName}`,
      user_registered,
      meta: [{ meta_key: 'phr_id', meta_value: authHeader.masterPhrId }],
    });
  }

  async findOrCreateFromRequest(authHeader: FromRequestOptions) {
    const user = await User.query()
      .modify('phrId', authHeader.masterPhrId)
      .first();

    return user || this.createFromRequest(authHeader);
  }
}

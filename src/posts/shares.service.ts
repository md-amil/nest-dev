import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SharesService {
  async getPostShares(slug: string) {
    const response = await axios.get(
      `https://api.sharedcount.com/v1.0?apikey=${process.env.SHARED_COUNT_KEY}&url=https://bajajfinservhealth.in/articles/${slug}`,
    );

    const shares_count = {};

    for (const [platform, shares] of Object.entries(response.data)) {
      if (platform === 'Facebook') {
        shares_count[platform] = shares['share_count'];
      } else {
        shares_count[platform] = shares ?? 0;
      }
    }

    return shares_count;
  }
}

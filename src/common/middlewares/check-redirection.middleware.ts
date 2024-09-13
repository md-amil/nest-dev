import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { noFollowRedirectionStatusCode } from 'src/config/app';
import { Post } from 'src/posts/models/post.model';
import { RedirectionItem } from '../models/redirection-item.model';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CheckRedirectionMiddleware implements NestMiddleware {
  constructor(private cacheService: CacheService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const redirections = await this.cacheService.remember(
      'redirections',
      function() {
        return RedirectionItem.query().modify('enabled');
      },
    );
    let redirection: RedirectionItem, match: RegExpMatchArray;

    for (const redirectionItem of redirections) {
      match = req.url.match(new RegExp(redirectionItem.url));

      if (match) {
        redirection = redirectionItem;
        break;
      }
    }

    if (!redirection) {
      return next();
    }

    /** @see - User Story 121112: Set-3 Articles for Redirection **/
    if (
      redirection.url.startsWith('^/(?<api_version>v.*)/posts/') &&
      redirection.action_data.startsWith('/articles/')
    ) {
      const newSlug = redirection.action_data.replace('/articles/', '');
      let oldSlug = redirection.url.replace('^/(?<api_version>v.*)/posts/', '');

      if (oldSlug.endsWith('$')) oldSlug = oldSlug.slice(0, -1);

      await Post.query()
        .patch({ post_name: newSlug })
        .where('post_name', oldSlug);
    }

    let permanent = false;
    switch (redirection.action_code) {
      case HttpStatus.MOVED_PERMANENTLY:
      case HttpStatus.PERMANENT_REDIRECT:
        permanent = true;
    }

    let destination = redirection.action_data;
    for (const [key, value] of Object.entries(match.groups || {})) {
      destination = destination.replace(`$${key}`, value);
    }

    res.status(noFollowRedirectionStatusCode).json({
      destination,
      permanent,
    });
  }
}

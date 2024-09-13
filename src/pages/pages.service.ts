import { Injectable } from '@nestjs/common';
import { attachMeta } from 'src/common/helpers/meta.helper';
import { Page } from './models/page.model';
import { Partner } from './models/partner.model';

@Injectable()
export class PagesService {
  async getAboutUs() {
    const about = await Page.query()
      .where('post_name', 'about-us')
      .select('ID', 'post_title')
      .withGraphFetched('meta')
      .first();
    const partners = await Partner.query()
      .select('ID', 'post_title')
      .debug()
      .withGraphFetched('meta')
      .withGraphFetched('logo');

    return {
      ...about.toJSON(),
      partners: attachMeta(partners, {
        alias: { partner_website_link: 'website_link' },
      }),
    };
  }

  getDoctorRX() {
    return Page.query().where('post_name', 'doctorrx').first();
  }
}

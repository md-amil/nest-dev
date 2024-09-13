import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { Page } from './models/page.model';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private pageService: PagesService) {}

  @Get('/about-us')
  async getAboutUs() {
    return this.pageService.getAboutUs();
  }

  @Get('/:page')
  async getPage(@Param('page') name: string) {
    const page = await Page.query()
      .where('post_name', name)
      .withGraphFetched('meta')
      .first();
    if (!page) {
      throw new HttpException(`Page ${name} not found`, 404);
    }
    return page;
  }
}

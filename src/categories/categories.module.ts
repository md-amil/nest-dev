import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { WebStoryCategories } from './web-story-categories.controller';

@Module({
  controllers: [CategoriesController, WebStoryCategories],
})
export class CategoriesModule {}

import { Category as BaseCategory } from 'src/categories/models/category.model';

export class Category extends BaseCategory {
  /**
   * Override default query to be used only for category not for post category.
   */
  static onCreateQuery() {
    // this is important, don't remove.
  }
}

import { Category } from './category';

export class Item {
  email?: string;
  id?: number;
  name?: string;
  description?: string;
  entryDate?: Date;
  quantity: number;
  categories?: Category[];
  items?: Item[];

}


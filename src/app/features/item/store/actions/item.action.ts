import { QueryParams } from '@tps/models/pagination-params';
import { Item } from './../../../../models/item';

export class CreateCategory {
  static readonly type = '[ItemState] CreateCategory';
  constructor(readonly category: string) {}
}

export class CreateItem {
  static readonly type = '[ItemState] CreateItem';
  constructor(readonly item: Item) {}
}

export class GetCategories {
  static readonly type = '[ItemState] GetCategories';
  constructor(readonly payload?: any) {}
}

export class GetItems {
  static readonly type = '[ItemState] GetItems';
  constructor(public payload?: any) {}
}

export class GetItemById {
  static readonly type = '[ItemState] GetItemById';
  constructor(readonly payload?: any) {}
}


export class UpdateItem {
  static readonly type = '[ItemState] UpdateItem';
  constructor(public item: Item) {}
}

export class GetItemSearchList {
  static readonly type = '[ItemState] GetItemSearchList';
  constructor(readonly payload: QueryParams) {}
}

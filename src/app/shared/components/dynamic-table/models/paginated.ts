export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Paginated<T> {
  content: T[];
  pageable?: Pageable;
  last?: boolean;
  totalPages?: number;
  totalElements: number;
  first?: boolean;
  number?: number;
  sort?: Sort;
  numberOfElements?: number;
  size: number;
  empty?: boolean;
}

import { TemplateRef } from '@angular/core';
import { NzTableSortOrder } from 'ng-zorro-antd';

export interface DynamicColumn {
  name?: string;
  key: string;
  isDate?: boolean;
  template?: TemplateRef<any>;
  isVisible?: boolean;
  sort?: boolean;
  onClick?(row: any): any;
}

export interface DynamicAction {
  name: string;
  icon?: string;
  class?: string;
  permissions?: string[];
  onClick?(item: any): void;
}

export interface DynamicBulkAction {
  name: string;
  class?: string;
  template?: TemplateRef<any>;
  permissions?: string[];
  children?: DynamicBulkAction[];
  onClick?(item: Set<any>): void;
}

export enum DynamicActionType {
  DROPDOWN,
  SINGLE_COLUMN
}

export interface DynamicStatus {
  status: string;
  count: number;
  ignoreOnCount?: false;
}

export interface DynamicQueryParams {
  pageIndex: number;
  pageSize: number;
  sort: { key: string; value: NzTableSortOrder }[];
  filter: { key: string; value: any | any[] }[];
  status: string;
  searchQuery: string;
}

export interface DynamicFrontendPaginationConfig {
  pageSize: number;
}

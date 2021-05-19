import { DynamicQueryParams } from '../models/dynamic-table';

export const DynamicQueryParamToQueryParam = (query: DynamicQueryParams): { [param: string]: string | string[] } => {
  const params: { [params: string]: string } = {};
  params['page'] = `${query.pageIndex - 1}`;
  params['size'] = `${query.pageSize}`;
  params['query'] = '';
  const sortDirection = { ascend: 'asc', descend: 'desc' };
  const sortIndex = query.sort.findIndex((sorter) => sorter.value !== null);
  if (sortIndex !== -1) {
    const sortItem = query.sort[sortIndex];
    params['sort'] = `${sortItem.key},${sortDirection[sortItem.value]}`;
  } else {
    params['sort'] = 'id,desc';
  }
  if (query.status) {
    params['status'] = query.status;
  }
  if (query.searchQuery && query.searchQuery !== '') {
    params['query'] = query.searchQuery;
  }

  return params;
};

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { includes, isEqual, keys } from 'lodash-es';
import { NzNotificationService, NzTableQueryParams } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  DynamicAction,
  DynamicActionType,
  DynamicBulkAction,
  DynamicColumn,
  DynamicFrontendPaginationConfig,
  DynamicQueryParams,
  DynamicStatus
} from './models/dynamic-table';
import { Paginated } from './models/paginated';

@Component({
  selector: 'tps-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input() data: Paginated<T> | any;
  checked = false;
  indeterminate = false;
  @Input() loading: boolean;
  @Input() frontendPagination? = false;
  @Input() frontendPaginationConfig?: DynamicFrontendPaginationConfig = { pageSize: 6 };
  @Input() columns: DynamicColumn[];
  @Input() overwriteColumns?: string[] = [];
  @Input() bulkActions?: DynamicBulkAction[];
  @Input() actions?: DynamicAction[];
  @Input() statusFilters?: DynamicStatus[];
  @Input() allStatusTitle = 'ALL';
  @Input() nullText = 'N/A';
  @Input() showSearch = false;
  @Input() showColumnSelector = false;
  @Input() showStatusFilters = false;
  @Input() isBulkActionLocationTop = true;
  @Input() searchPlaceholder = 'Search Item';
  @Input() bulkActionNoItemSelectedErrorTitle = 'No Item is selected';
  @Input() bulkActionNoItemSelectedErrorDescription = 'Please select items before continuing with action.';
  @Input() actionColumnName = 'Action';
  @Input() debounceSearchValue = true;
  @Input() actionType: DynamicActionType = DynamicActionType.DROPDOWN;
  setOfCheckedId = new Set<number>();
  headers: string[] = [];
  defaultColumns: DynamicColumn[] = [];
  actionTypes = DynamicActionType;
  options: { label: string; value: DynamicColumn; checked: boolean }[] = [];
  visible = false;
  searchInput = '';
  searchQuery: string = undefined;
  activeStatus: string;
  statuses: DynamicStatus[];
  currentQueryParam: NzTableQueryParams;
  @Output() readonly OnSelectedColumnChanged: EventEmitter<string[]> = new EventEmitter();
  @Output() readonly OnQueryParamsChange?: EventEmitter<DynamicQueryParams> = new EventEmitter();

  private readonly debouncer$ = new Subject<string>();

  constructor(private readonly notification: NzNotificationService) {
    this.debouncer$.pipe(debounceTime(300)).subscribe((value) => {
      this.searchQuery = value;
      this.sendQueryParam();
    });
  }

  ngOnInit(): any {
    if (this.data?.content) {
      this.headers = keys(this.data.content[0]);
    }
    if (this.overwriteColumns && this.overwriteColumns.length > 0 && this.columns) {
      this.onOverwriteColumnsChange(this.overwriteColumns);
    }
    if (this.columns) {
      this.onColumnsChanged(this.columns);
    }

    if (this.statusFilters && this.statusFilters.length > 0) {
      this.onFilterStatusChanged(this.statusFilters);
    }
    this.activeStatus = this.allStatusTitle;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.overwriteColumns) {
      const overwriteColumns = changes.overwriteColumns.currentValue;
      this.onOverwriteColumnsChange(overwriteColumns);
    }
    if (changes.columns) {
      const columns = changes.columns.currentValue;
      if (columns) {
        this.onColumnsChanged(columns);
      }
    }
    if (changes.statusFilters && changes.statusFilters.currentValue && changes.statusFilters.currentValue.length > 0) {
      const statusFilter = changes.statusFilters.currentValue;
      this.onFilterStatusChanged(statusFilter);
    }
  }

  private onFilterStatusChanged(dynamicStatus: DynamicStatus[]): void {
    const filteredStatusFilter = dynamicStatus.filter((item) => item.status !== this.allStatusTitle);
    const filteredStatusFilterForCount = filteredStatusFilter.filter((item) => (item.ignoreOnCount ? !item.ignoreOnCount : true));
    const count = filteredStatusFilterForCount.reduce((reduced: number, current: DynamicStatus) => reduced + current.count, 0);
    filteredStatusFilter.unshift({ status: this.allStatusTitle, count });
    this.statuses = filteredStatusFilter;
  }

  private onColumnsChanged(columns: DynamicColumn[]): void {
    this.options = columns.map((column) => {
      return { label: column.name ? column.name : column.key, value: column, checked: column.isVisible };
    });
    this.defaultColumns = columns.filter((column) => column.isVisible);
  }

  private onOverwriteColumnsChange(overwriteColumns: string[]): void {
    if (this.columns && overwriteColumns.length > 0) {
      this.columns = this.columns.map((column) => {
        column.isVisible = includes(overwriteColumns, column.key);

        return column;
      });
    }
  }

  ngOnDestroy(): void {
    this.debouncer$.next();
    this.debouncer$.complete();
  }

  onSearch(searchTerm: string): void {
    if (this.debounceSearchValue) {
      this.debouncer$.next(searchTerm);
    } else {
      this.searchQuery = searchTerm;
      this.sendQueryParam();
    }
  }

  queryParamChanged(params: NzTableQueryParams): void {
    if (!isEqual(this.currentQueryParam, params)) {
      this.currentQueryParam = params;
      this.sendQueryParam();
    }
  }

  sendQueryParam(): void {
    const dynamicFilter: DynamicQueryParams = {
      filter: this.currentQueryParam.filter,
      sort: this.currentQueryParam.sort,
      pageIndex: this.currentQueryParam.pageIndex,
      pageSize: this.currentQueryParam.pageSize,
      status: this.activeStatus,
      searchQuery: this.searchQuery
    };
    this.OnQueryParamsChange.emit(dynamicFilter);
  }

  optionChanged(event?: any): void {
    const selectedOptions =
      event !== undefined ? event.filter((option) => option.checked) : this.options.filter((option) => option.checked);
    this.defaultColumns = selectedOptions.map((option) => option.value);
    if (this.OnSelectedColumnChanged) {
      this.OnSelectedColumnChanged.emit(selectedOptions.map((option) => option.value.key));
    }
  }

  identity(index, item): number {
    return item.id;
  }

  identityBulkAction(index, item): string {
    return `bulkAction${index}`;
  }

  identityStatusFilter(index, item): string {
    return `statusFilter${index}`;
  }

  identityAction(index, item): string {
    return `action${index}`;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onAllChecked(checked: boolean): void {
    if (this.frontendPagination) {
      //TODO: Select page data on click all
      this.data.forEach((item: any) => {
        this.updateCheckedSet(item.id, checked);
      });
    } else {
      this.data.content.forEach((item: any) => {
        this.updateCheckedSet(item.id, checked);
      });
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  statusFilterClicked(item: DynamicStatus): void {
    this.activeStatus = item.status;
    this.sendQueryParam();
  }

  bulkActionClicked = (action: DynamicBulkAction): void => {
    if (this.setOfCheckedId.size > 0) {
      action.onClick(this.setOfCheckedId);
      this.setOfCheckedId = new Set<number>();
    } else {
      this.notification.create('warning', this.bulkActionNoItemSelectedErrorTitle, this.bulkActionNoItemSelectedErrorDescription, {
        nzPlacement: 'bottomRight'
      });
    }
  };
}

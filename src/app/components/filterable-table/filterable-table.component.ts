import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';

import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { PaginationBarComponent } from '../pagination-bar/pagination-bar.component';
import { PagingFilter, SortFilter } from '../../models/securities-filter';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

export interface ColumnConfig{
  id: string;
  label: string;
}

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinner,
    MatTableModule,
    FilterBarComponent,
    PaginationBarComponent,
    MatSortModule,
  ],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> {
  @Input() columns: ColumnConfig[] = [];
  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;

  @Output() sortChange = new EventEmitter<SortFilter>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<PagingFilter>();
  @Input() totalItems: number | null = 0;
  @Input() filterSchema = {};

  get displayedColumnIds(): string[] {
    return this.columns.map((col) => col.id);
  }

  public onFilterChange(filter: any) {
    this.filterChange.emit(filter);
  }

  public onPageChange(pagingFilter: PagingFilter) {
    this.pageChange.emit(pagingFilter);
  }

  public onSortChange(sort: Sort) {
    const sortfilter: SortFilter = { sortBy: sort.active, sortDir: sort.direction };
    this.sortChange.emit(sortfilter);
  }
}

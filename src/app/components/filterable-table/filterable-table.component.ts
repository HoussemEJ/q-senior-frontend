import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { PaginationBarComponent } from '../pagination-bar/pagination-bar.component';
import { PagingFilter } from '../../models/securities-filter';
import { FieldSuggestions } from '../../models/field-suggestions';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatTable,
    FilterBarComponent,
    PaginationBarComponent,
  ],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;

  @Output() filterChange = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<PagingFilter>();
  @Input() totalItems: number | null = 0;
  @Input() filterSchema = {};

  @Input() fieldSuggestions?: FieldSuggestions;

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef),
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef),
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }

  public onFilterChange(filter: any) {
    this.filterChange.emit(filter);
  }

  public onPageChange(pagingFilter: PagingFilter) {
    this.pageChange.emit(pagingFilter);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PagingFilter } from '../../models/securities-filter';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'pagination-bar',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination-bar.component.html',
  styleUrl: './pagination-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationBarComponent {
  @Input() totalItems: number | null = 0;
  @Output() pageChange = new EventEmitter<PagingFilter>();

  limit: number = 100;
  pageSizes: number[] = [10, 25, 50, 100];
  pagingFilter: PagingFilter = {};

  onPageEvent(event: PageEvent) {
    this.pagingFilter.skip = event.pageIndex * event.pageSize;
    this.pagingFilter.limit = event.pageSize;
    this.pageChange.emit(this.pagingFilter);
  }
}

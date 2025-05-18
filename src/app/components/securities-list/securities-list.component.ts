import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { PagingFilter, SecuritiesFilter } from '../../models/securities-filter';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = new Observable();
  protected totalItems$: Observable<number> = new Observable();

  private securitiesFilter: SecuritiesFilter = {};
  private pagingFilter: PagingFilter = {};

  protected filterSchema: any = {
    name: '',
    types: [
      'Equity',
      'Closed-endFund',
      'BankAccount',
      'DirectHolding',
      'Collectible',
      'Loan',
      'RealEstate',
      'Generic',
    ],
    currencies: ['USD', 'EUR', 'GBP'],
    isPrivate: false,
    period: { start: new Date(), end: new Date() },
  };

  constructor() {
    this.loadSecurities();
  }

  private loadSecurities() {
    const filter = { ...this.securitiesFilter, ...this.pagingFilter };
    const result$ = this._securityService
      .getSecurities(filter)
      .pipe(indicate(this.loadingSecurities$));

    this.securities$ = result$.pipe(map((res) => res.securities));
    this.totalItems$ = result$.pipe(map((res) => res.total));
  }

  public onFilterChange(securitiesFilter: SecuritiesFilter) {
    this.securitiesFilter = securitiesFilter;
    this.loadSecurities();
  }

  public onPageChange(pagingFilter: PagingFilter) {
    this.pagingFilter = pagingFilter;
    this.loadSecurities();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import {
  PagingFilter,
  SecuritiesFilter,
  SortFilter,
} from '../../models/securities-filter';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [FilterableTableComponent, AsyncPipe],
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

  protected columns = [
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'currency', label: 'Currency' },
  ];
  
  private securitiesFilter: SecuritiesFilter = {};
  protected filterSchema: SecuritiesFilter = {
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
  };

  constructor() {
    this.loadSecurities();
  }

  private loadSecurities() {
    const result$ = this._securityService
      .getSecurities(this.securitiesFilter)
      .pipe(indicate(this.loadingSecurities$));

    this.securities$ = result$.pipe(map((res) => res.securities));
    this.totalItems$ = result$.pipe(map((res) => res.total));
  }

  public onFilterChange(filter: SecuritiesFilter) {
    this.securitiesFilter = { ...this.securitiesFilter, ...filter };
    this.loadSecurities();
  }

  public onPageChange(page: PagingFilter) {
    this.securitiesFilter = { ...this.securitiesFilter, ...page };
    this.loadSecurities();
  }

  public onSortChange(sort: SortFilter) {
    this.securitiesFilter = {
      ...this.securitiesFilter,
      ...sort,
    };
    this.loadSecurities();
  }
}

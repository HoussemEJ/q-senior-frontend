import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(
    securityFilter?: SecuritiesFilter,
  ): Observable<{ securities: Security[]; total: number }> {
    const filteredSecurities = this._filterSecurities(securityFilter);
    const total = filteredSecurities.length;
    const paginatedSecurities = filteredSecurities.slice(
      securityFilter?.skip ?? 0,
      (securityFilter?.skip ?? 0) + (securityFilter?.limit ?? 100),
    );

    return of({ securities: paginatedSecurities, total }).pipe(delay(1000));
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined,
  ): Security[] {
    if (!securityFilter) return SECURITIES;
    console.log(securityFilter);
    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name ||
          s.name.toLowerCase().includes(securityFilter.name.toLowerCase())) &&
        (!securityFilter.types ||
          securityFilter.types.length === 0 ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.length === 0 ||
          securityFilter.currencies.some(
            (currency) => s.currency == currency,
          )) &&
        (securityFilter.isPrivate === true ? s.isPrivate : true),
    );
  }
}

import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';
import { FieldSuggestions } from '../models/field-suggestions';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  suggestions = signal<FieldSuggestions | undefined>(undefined);

  /**
   * Get Securities server request mock
   * */
  getSecurities(
    securityFilter?: SecuritiesFilter,
  ): Observable<{ securities: Security[]; total: number }> {
    const filteredSecurities = this._filterSecurities(securityFilter);

    this.updateSuggestions(filteredSecurities, securityFilter);

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

  // TODO: frequency check
  private updateSuggestions(
    securities: Security[],
    filter?: SecuritiesFilter,
  ): void {
    const query = filter?.name?.toLowerCase();

    if (!query) {
      this.suggestions.set(undefined);
      return;
    }

    const tokens = query.split(' ');
    const lastTyped = tokens[tokens.length - 1];

    const list = securities.map((s) => s.name.toLowerCase());
    const suggestions = new Set<string>();

    for (const item of list) {
      const start =
        lastTyped === '' && tokens.length > 1
          ? item.indexOf(query) + query.length
          : item.indexOf(lastTyped);
      console.log(start);
      if (start === -1) continue;

      const end = start + lastTyped.length;
      const words = item.split(' ');

      const current =
        words.find((word) => item.indexOf(word) === start) || null;
      const next = words.find((word) => item.indexOf(word) === end) || null;

      if (lastTyped === '' && next) suggestions.add(query + next);
      else if (current) suggestions.add(current);
      else if (next) suggestions.add(query + next);
    }

    this.suggestions.set({
      field: 'name',
      suggestions: Array.from(suggestions),
    });
  }
}

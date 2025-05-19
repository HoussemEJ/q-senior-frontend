export interface PagingFilter {
  skip?: number;
  limit?: number;
}

export interface SortFilter extends PagingFilter {
  sortBy?: string;
  sortDir?: string;
}

export interface SecuritiesFilter extends SortFilter {
  name?: string;
  types?: string[];
  currencies?: string[];
  isPrivate?: boolean;
}

import { defer, finalize, Observable, Subject } from 'rxjs';

export function prepare<T>(
  callback: () => void,
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}

export function indicate<T>(
  indicator: Subject<boolean>,
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => {
        console.log('prepare');
        indicator.next(true);
      }),
      finalize(() => {
        console.log('finalize');
        indicator.next(false);
      }),
    );
}

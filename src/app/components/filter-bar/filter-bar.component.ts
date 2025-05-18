import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { distinctUntilChanged, filter, map, Subscription } from 'rxjs';

type ArrayTypes = string[] | number[];
type SupportedTypes = string | number | ArrayTypes | boolean;

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent<T extends Record<string, SupportedTypes>>
  implements OnInit, OnDestroy
{
  private fb = inject(FormBuilder);

  @Input() filterSchema: T = {} as T;
  @Output() filterChange = new EventEmitter<T>();

  form!: FormGroup;
  private filterSub!: Subscription;

  ngOnInit() {
    this.form = this.buildForm(this.filterSchema);

    this.filterSub = this.form.valueChanges
      .pipe(
        map((v) => this.cleanFilter<T>(v)),
        filter((f) => Object.keys(f).length > 0),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
      )
      .subscribe((validFilter) => {
        this.filterChange.emit(validFilter as T);
      });
  }

  ngOnDestroy() {
    this.filterSub.unsubscribe();
  }

  /** Build form based on schema keys */
  private buildForm(filterSchema: T): FormGroup {
    const controls: Record<string, FormControl> = {};

    Object.keys(filterSchema).forEach((key) => {
      const type = this.getType(key);
      if (type) {
        controls[key] = this.fb.control(null);
      }
    });

    return this.fb.group(controls);
  }

  /** Remove null or undefined fields */
  cleanFilter<T>(value: Record<string, any>): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(([_, v]) => v != null),
    ) as Partial<T>;
  }

  /** Get schema key type to render the fields */
  getType(key: string): 'string' | 'number' | 'array' | 'boolean' | undefined {
    const value = this.filterSchema[key];
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return undefined;
  }

  /** Return schema keys, sorted by type priority (priority controls rendering order) */
  getKeys(): string[] {
    const priority = ['string', 'number', 'array', 'boolean'] as const;

    return Object.keys(this.filterSchema).sort((a, b) => {
      const ta = this.getType(a) as (typeof priority)[number];
      const tb = this.getType(b) as (typeof priority)[number];

      return priority.indexOf(ta) - priority.indexOf(tb);
    });
  }

  /** Return array initial values from the schema to be set as dropdown */
  getArrayOptions(key: string): ArrayTypes {
    const value = this.filterSchema[key];
    return Array.isArray(value) ? value : [];
  }

  /** Reset all filters */
  resetFilters() {
    this.form.reset();
    this.filterChange.emit({} as T);
  }
}

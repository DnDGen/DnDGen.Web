import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { filter, map, merge, Observable, OperatorFunction, Subject } from 'rxjs';

@Component({
    selector: 'dndgen-searchable-select',
    templateUrl: './searchable-select.component.html',
    standalone: true,
    imports: [FormsModule, NgbTypeaheadModule]
})

export class SearchableSelectComponent {
  @Input() id: string = '';
  @Input() options: string[] = [];
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() clearOnSelect: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('typeahead', { static: true }) typeahead?: NgbTypeahead;
  @ViewChild('input', { static: true }) input?: ElementRef<HTMLInputElement>;

  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();

  public search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.typeahead!.isPopupOpen()));

    return merge(text$, this.focus$, clicksWithClosedPopup$).pipe(
      map(term => this.filter(term))
    );
  };

  public filter(term: string): string[] {
    const lowerTerm = term.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(lowerTerm));
  }

  public select(event: NgbTypeaheadSelectItemEvent<string>): void {
    if (this.clearOnSelect) {
      event.preventDefault();
      this.input!.nativeElement.value = '';
    }

    this.valueChange.emit(event.item);
  }

  public restoreValue(): void {
    if (this.typeahead!.isPopupOpen())
      return;

    this.input!.nativeElement.value = this.clearOnSelect ? '' : this.value;
  }
}

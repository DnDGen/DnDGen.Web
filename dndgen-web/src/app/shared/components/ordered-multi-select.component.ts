import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchableSelectComponent } from './searchable-select.component';

@Component({
    selector: 'dndgen-ordered-multi-select',
    templateUrl: './ordered-multi-select.component.html',
    standalone: true,
    imports: [SearchableSelectComponent]
})

export class OrderedMultiSelectComponent {
  @Input() id: string = '';
  @Input() options: string[] = [];
  @Input() selected: string[] = [];
  @Input() placeholder: string = '';
  @Input() emptyText: string = '';
  @Output() selectedChange = new EventEmitter<string[]>();

  public get available(): string[] {
    return this.options.filter(option => !this.selected.includes(option));
  }

  public add(option: string): void {
    this.update([...this.selected, option]);
  }

  public moveUp(index: number): void {
    this.swap(index - 1, index);
  }

  public moveDown(index: number): void {
    this.swap(index, index + 1);
  }

  public remove(index: number): void {
    this.update(this.selected.filter((_, i) => i != index));
  }

  private swap(first: number, second: number): void {
    const updated = [...this.selected];
    [updated[first], updated[second]] = [updated[second], updated[first]];
    this.update(updated);
  }

  private update(updated: string[]): void {
    this.selected = updated;
    this.selectedChange.emit(updated);
  }
}

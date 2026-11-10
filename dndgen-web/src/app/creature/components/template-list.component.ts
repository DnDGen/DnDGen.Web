import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchableSelectComponent } from '../../shared/components/searchable-select.component';

@Component({
    selector: 'dndgen-template-list',
    templateUrl: './template-list.component.html',
    standalone: true,
    imports: [SearchableSelectComponent]
})

export class TemplateListComponent {
  //INFO: Every template is offered, including "None" and ones already chosen.
  //"None" forces a random creature to have no template, and CreatureGen's validation decides which repeats are valid.
  @Input() id: string = '';
  @Input() templates: string[] = [];
  @Input() selected: string[] = [];
  @Input() emptyText: string = '';
  @Output() selectedChange = new EventEmitter<string[]>();

  public add(template: string): void {
    this.update([...this.selected, template]);
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

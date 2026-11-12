import { describe, it, expect, beforeEach } from 'vitest';
import { OrderedMultiSelectComponent } from './ordered-multi-select.component';

describe('Ordered Multi-Select Component', () => {
  describe('unit', () => {
    let component: OrderedMultiSelectComponent;
    let emitted: string[][];

    beforeEach(() => {
      component = new OrderedMultiSelectComponent();
      component.options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

      emitted = [];
      component.selectedChange.subscribe(selected => emitted.push(selected));
    });

    it('initializes the inputs', () => {
      const newComponent = new OrderedMultiSelectComponent();
      expect(newComponent.id).toBe('');
      expect(newComponent.options).toEqual([]);
      expect(newComponent.selected).toEqual([]);
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.emptyText).toBe('');
    });

    const availables = [
      { name: 'every option when none are selected', selected: [], expected: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] },
      { name: 'the options not selected when 1 is selected', selected: ['Option 2'], expected: ['Option 1', 'Option 3', 'Option 4'] },
      { name: 'the options not selected when many are selected', selected: ['Option 4', 'Option 1', 'Option 3'], expected: ['Option 2'] },
      { name: 'nothing when every option is selected', selected: ['Option 3', 'Option 1', 'Option 4', 'Option 2'], expected: [] },
    ];

    availables.forEach(test => {
      it(`offers ${test.name}`, () => {
        component.selected = test.selected;
        expect(component.available).toEqual(test.expected);
      });
    });

    const additions = [
      { name: 'to no options', selected: [], added: 'Option 1', expected: ['Option 1'] },
      { name: 'to 1 option', selected: ['Option 1'], added: 'Option 2', expected: ['Option 1', 'Option 2'] },
      { name: 'to many options', selected: ['Option 1', 'Option 2', 'Option 4'], added: 'Option 3', expected: ['Option 1', 'Option 2', 'Option 4', 'Option 3'] },
    ];

    additions.forEach(test => {
      it(`adds an option to the end - ${test.name}`, () => {
        component.selected = test.selected;

        component.add(test.added);

        expect(emitted).toEqual([test.expected]);
        expect(component.selected).toEqual(test.expected);
        expect(component.available).not.toContain(test.added);
      });
    });

    const moves = [
      { name: 'the second of 2 up', selected: ['Option 1', 'Option 2'], index: 1, up: true, expected: ['Option 2', 'Option 1'] },
      { name: 'the first of 2 down', selected: ['Option 1', 'Option 2'], index: 0, up: false, expected: ['Option 2', 'Option 1'] },
      { name: 'the last of 3 up', selected: ['Option 1', 'Option 2', 'Option 3'], index: 2, up: true, expected: ['Option 1', 'Option 3', 'Option 2'] },
      { name: 'the middle of 3 up', selected: ['Option 1', 'Option 2', 'Option 3'], index: 1, up: true, expected: ['Option 2', 'Option 1', 'Option 3'] },
      { name: 'the middle of 3 down', selected: ['Option 1', 'Option 2', 'Option 3'], index: 1, up: false, expected: ['Option 1', 'Option 3', 'Option 2'] },
      { name: 'the first of 3 down', selected: ['Option 1', 'Option 2', 'Option 3'], index: 0, up: false, expected: ['Option 2', 'Option 1', 'Option 3'] },
    ];

    moves.forEach(test => {
      it(`moves ${test.name}`, () => {
        component.selected = test.selected;

        if (test.up)
          component.moveUp(test.index);
        else
          component.moveDown(test.index);

        expect(emitted).toEqual([test.expected]);
        expect(component.selected).toEqual(test.expected);
      });
    });

    const removals = [
      { name: 'the only option', selected: ['Option 1'], index: 0, expected: [] },
      { name: 'the first of 3', selected: ['Option 1', 'Option 2', 'Option 3'], index: 0, expected: ['Option 2', 'Option 3'] },
      { name: 'the middle of 3', selected: ['Option 1', 'Option 2', 'Option 3'], index: 1, expected: ['Option 1', 'Option 3'] },
      { name: 'the last of 3', selected: ['Option 1', 'Option 2', 'Option 3'], index: 2, expected: ['Option 1', 'Option 2'] },
    ];

    removals.forEach(test => {
      it(`removes ${test.name}, offering it again`, () => {
        component.selected = test.selected;
        const removed = test.selected[test.index];

        component.remove(test.index);

        expect(emitted).toEqual([test.expected]);
        expect(component.selected).toEqual(test.expected);
        expect(component.available).toContain(removed);
      });
    });

    const actions = [
      { name: 'adding', act: (c: OrderedMultiSelectComponent) => c.add('Option 3') },
      { name: 'moving up', act: (c: OrderedMultiSelectComponent) => c.moveUp(1) },
      { name: 'moving down', act: (c: OrderedMultiSelectComponent) => c.moveDown(0) },
      { name: 'removing', act: (c: OrderedMultiSelectComponent) => c.remove(0) },
    ];

    actions.forEach(test => {
      it(`does not change the parent's list when ${test.name}`, () => {
        const original = ['Option 1', 'Option 2'];
        component.selected = original;

        test.act(component);

        expect(original).toEqual(['Option 1', 'Option 2']);
      });
    });
  });
});

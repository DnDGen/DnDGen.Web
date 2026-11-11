import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateListComponent } from './template-list.component';

describe('Template List Component', () => {
  describe('unit', () => {
    let component: TemplateListComponent;
    let emitted: string[][];

    beforeEach(() => {
      component = new TemplateListComponent();
      component.templates = ['Ghost', 'Lich', 'None', 'Vampire'];

      emitted = [];
      component.selectedChange.subscribe(selected => emitted.push(selected));
    });

    it('initializes the inputs', () => {
      const newComponent = new TemplateListComponent();
      expect(newComponent.id).toBe('');
      expect(newComponent.templates).toEqual([]);
      expect(newComponent.selected).toEqual([]);
      expect(newComponent.emptyText).toBe('');
    });

    const additions = [
      { name: 'to no templates', selected: [], added: 'Ghost', expected: ['Ghost'] },
      { name: 'to 1 template', selected: ['Ghost'], added: 'Lich', expected: ['Ghost', 'Lich'] },
      { name: 'to 2 templates', selected: ['Ghost', 'Lich'], added: 'Vampire', expected: ['Ghost', 'Lich', 'Vampire'] },
      { name: 'None to no templates', selected: [], added: 'None', expected: ['None'] },
      { name: 'None again', selected: ['None'], added: 'None', expected: ['None', 'None'] },
      { name: 'a template already in the list', selected: ['Ghost'], added: 'Ghost', expected: ['Ghost', 'Ghost'] },
    ];

    additions.forEach(test => {
      it(`adds a template to the end - ${test.name}`, () => {
        component.selected = test.selected;

        component.add(test.added);

        expect(emitted).toEqual([test.expected]);
        expect(component.selected).toEqual(test.expected);
      });
    });

    const moves = [
      { name: 'the second of 2 up', selected: ['Ghost', 'Lich'], index: 1, up: true, expected: ['Lich', 'Ghost'] },
      { name: 'the first of 2 down', selected: ['Ghost', 'Lich'], index: 0, up: false, expected: ['Lich', 'Ghost'] },
      { name: 'the last of 3 up', selected: ['Ghost', 'Lich', 'Vampire'], index: 2, up: true, expected: ['Ghost', 'Vampire', 'Lich'] },
      { name: 'the middle of 3 up', selected: ['Ghost', 'Lich', 'Vampire'], index: 1, up: true, expected: ['Lich', 'Ghost', 'Vampire'] },
      { name: 'the middle of 3 down', selected: ['Ghost', 'Lich', 'Vampire'], index: 1, up: false, expected: ['Ghost', 'Vampire', 'Lich'] },
      { name: 'the first of 3 down', selected: ['Ghost', 'Lich', 'Vampire'], index: 0, up: false, expected: ['Lich', 'Ghost', 'Vampire'] },
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
      { name: 'the only template', selected: ['Ghost'], index: 0, expected: [] },
      { name: 'the first of 3', selected: ['Ghost', 'Lich', 'Vampire'], index: 0, expected: ['Lich', 'Vampire'] },
      { name: 'the middle of 3', selected: ['Ghost', 'Lich', 'Vampire'], index: 1, expected: ['Ghost', 'Vampire'] },
      { name: 'the last of 3', selected: ['Ghost', 'Lich', 'Vampire'], index: 2, expected: ['Ghost', 'Lich'] },
      { name: 'one of 2 repeated templates', selected: ['None', 'None'], index: 1, expected: ['None'] },
    ];

    removals.forEach(test => {
      it(`removes ${test.name}`, () => {
        component.selected = test.selected;

        component.remove(test.index);

        expect(emitted).toEqual([test.expected]);
        expect(component.selected).toEqual(test.expected);
      });
    });

    const actions = [
      { name: 'adding', act: (c: TemplateListComponent) => c.add('Vampire') },
      { name: 'moving up', act: (c: TemplateListComponent) => c.moveUp(1) },
      { name: 'moving down', act: (c: TemplateListComponent) => c.moveDown(0) },
      { name: 'removing', act: (c: TemplateListComponent) => c.remove(0) },
    ];

    actions.forEach(test => {
      it(`does not change the parent's list when ${test.name}`, () => {
        const original = ['Ghost', 'Lich'];
        component.selected = original;

        test.act(component);

        expect(original).toEqual(['Ghost', 'Lich']);
      });
    });
  });
});

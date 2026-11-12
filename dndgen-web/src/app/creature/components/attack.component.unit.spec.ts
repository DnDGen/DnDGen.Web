import { describe, it, expect, beforeEach } from 'vitest';
import { AttackComponent } from './attack.component';
import { Attack } from '../models/attack.model';

describe('Attack Component', () => {
  describe('unit', () => {
    let component: AttackComponent;

    beforeEach(() => {
      component = new AttackComponent();
    });

    it('should show the standard attack bonus by default, not the full attack bonuses', () => {
      expect(component.full).toBe(false);
    });

    it('should set the attack', () => {
      const attack = new Attack('my attack');
      component.attack = attack;

      expect(component.attack).toBe(attack);
    });
  });
});

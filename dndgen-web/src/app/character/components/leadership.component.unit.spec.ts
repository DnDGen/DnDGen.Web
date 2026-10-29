import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LeadershipComponent } from './leadership.component';
import { Leadership } from '../models/leadership.model';
import { Character } from '../models/character.model';
import { TestHelper } from '../../test-helper';

describe('Leadership Component', () => {
  describe('unit', () => {
    let component: LeadershipComponent;

    beforeEach(() => {
      component = new LeadershipComponent();
    });
  
    it(`should set the leadership`, () => {
      const leadership = new Leadership(9266, ['my modifier', 'my other modifier']);
      component.leadership = leadership;

      expect(component.leadership).toBe(leadership);
    });
  
    it(`should set the cohort`, () => {
      const cohort = new Character('my cohort summary');
      component.cohort = cohort;

      expect(component.cohort).toBe(cohort);
    });
  
    it(`should set the cohort - null`, () => {
      component.cohort = null;

      expect(component.cohort).toBeNull();
    });
  
    it(`should set the followers`, () => {
      const followers =[
        new Character('my follower summary'),
        new Character('my other follower summary'),
      ];
      component.followers = followers;

      expect(component.followers).toBe(followers);
    });
  
    it(`should set the followers - empty`, () => {
      component.followers = [];

      expect(component.followers).toEqual([]);
    });
  });
});
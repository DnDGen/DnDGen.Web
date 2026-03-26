import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { TestHelper } from '../test-helper';

describe('ErrorComponent', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<ErrorComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([ErrorComponent]);
  
      fixture = TestBed.createComponent(ErrorComponent);
    });
  
    it('should create the error component', () => {
      const error = fixture.componentInstance;
      expect(error).toBeTruthy();
    });
  
    it('should render the "Critical Miss" header', async () => {
      await fixture.whenStable();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const header = compiled.querySelector('h1');
      expect(header).toBeDefined();
      expect(header?.textContent).toEqual('Critical Miss');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { TestHelper } from '../testHelper.spec';

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
  
    it('should render the "Critical Miss" header', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const header = compiled.querySelector('h1');
      expect(header).toBeDefined();
      expect(header?.textContent).toEqual('Critical Miss');
    });
  });
});

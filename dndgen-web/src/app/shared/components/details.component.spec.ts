import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { TestHelper } from '../../test-helper';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';

describe('Details Component', () => {
  describe('unit', () => {
    let component: DetailsComponent;
    
    beforeEach(() => {
      component = new DetailsComponent();
    });

    it('initializes the inputs', () => {
      expect(component.hasDetails).toBe(false);
      expect(component.heading).toBe('');
    });

    it('initializes as collapsed', () => {
      expect(component.collapsed).toBe(true);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<DetailsComponent>;
    let helper: TestHelper<DetailsComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([DetailsComponent]);

      TestBed.inject(NgbConfig).animation = false;
  
      fixture = TestBed.createComponent(DetailsComponent);
      helper = new TestHelper(fixture);
    });

    it('should create the details component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should be collapsed on init', () => {
      expect(fixture.componentInstance.collapsed).toBe(true);
    });
  
    it('should set the heading - no details', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = false;

      await helper.waitForChangeDetection();
  
      helper.expectTextContent('span.no-details-header', 'my heading');
      helper.expectExists('span.no-details-header', true);
      
      helper.expectExists('a.details-header', false);
      helper.expectExists('div.details-section', false);
    });
  
    it('should set the heading - has details', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      await helper.waitForChangeDetection();
  
      helper.expectExists('span.no-details-header', false);
      helper.expectExists('a.details-header', true);
      helper.expectExists('div.details-section', true);
      helper.expectTextContent('a.details-header', 'my heading');
    });

    it('should toggle the detail visibility', async () => {
      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;

      await helper.waitForChangeDetection();
      
      helper.expectExists('span.no-details-header', false);
      helper.expectExists('a.details-header', true);
      helper.expectExists(`div.details-section`, true);
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      helper.clickLink('a.details-header');
      await helper.waitForChangeDetection();
      
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse show');
      
      helper.clickLink('a.details-header');
      await helper.waitForChangeDetection();
      
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
    });

    it('should distinctly toggle the detail visibility', async () => {
      const otherFixture = TestBed.createComponent(DetailsComponent);
      const otherHelper = new TestHelper(otherFixture);

      fixture.componentInstance.heading = "my heading";
      fixture.componentInstance.hasDetails = true;
      otherFixture.componentInstance.heading = "my other heading";
      otherFixture.componentInstance.hasDetails = true;

      await helper.waitForChangeDetection();
      await otherHelper.waitForChangeDetection();
      
      helper.expectTextContent('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectTextContent('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      helper.clickLink('a.details-header');
      await helper.waitForChangeDetection();
      
      helper.expectTextContent('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse show');
      
      otherHelper.expectTextContent('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      helper.clickLink('a.details-header');
      await helper.waitForChangeDetection();
      
      helper.expectTextContent('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectTextContent('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');

      otherHelper.clickLink('a.details-header');
      await otherHelper.waitForChangeDetection();
      
      helper.expectTextContent('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectTextContent('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse show');

      otherHelper.clickLink('a.details-header');
      await otherHelper.waitForChangeDetection();
      
      helper.expectTextContent('a.details-header', 'my heading');
      helper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
      
      otherHelper.expectTextContent('a.details-header', 'my other heading');
      otherHelper.expectAttribute(`div.details-section`, 'class', 'details-section collapse');
    });
  });
});

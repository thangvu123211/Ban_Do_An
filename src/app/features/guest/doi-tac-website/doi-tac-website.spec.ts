import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoiTacWebsite } from './doi-tac-website';

describe('DoiTacWebsite', () => {
  let component: DoiTacWebsite;
  let fixture: ComponentFixture<DoiTacWebsite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoiTacWebsite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoiTacWebsite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

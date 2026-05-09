import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThongTin } from './step-thong-tin';

describe('StepThongTin', () => {
  let component: StepThongTin;
  let fixture: ComponentFixture<StepThongTin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepThongTin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepThongTin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

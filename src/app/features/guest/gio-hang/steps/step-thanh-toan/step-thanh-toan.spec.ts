import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThanhToan } from './step-thanh-toan';

describe('StepThanhToan', () => {
  let component: StepThanhToan;
  let fixture: ComponentFixture<StepThanhToan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepThanhToan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepThanhToan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

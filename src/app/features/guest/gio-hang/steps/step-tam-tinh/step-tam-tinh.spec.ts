import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTamTinh } from './step-tam-tinh';

describe('StepTamTinh', () => {
  let component: StepTamTinh;
  let fixture: ComponentFixture<StepTamTinh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepTamTinh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepTamTinh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

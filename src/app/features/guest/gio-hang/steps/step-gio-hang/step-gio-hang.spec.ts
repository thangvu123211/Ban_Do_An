import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepGioHang } from './step-gio-hang';

describe('StepGioHang', () => {
  let component: StepGioHang;
  let fixture: ComponentFixture<StepGioHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepGioHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepGioHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XacNhanThanhToan } from './xac-nhan-thanh-toan';

describe('XacNhanThanhToan', () => {
  let component: XacNhanThanhToan;
  let fixture: ComponentFixture<XacNhanThanhToan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XacNhanThanhToan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XacNhanThanhToan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

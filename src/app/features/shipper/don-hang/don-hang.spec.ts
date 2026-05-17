import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonHang } from './don-hang';

describe('DonHang', () => {
  let component: DonHang;
  let fixture: ComponentFixture<DonHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDonHang } from './thong-tin-don-hang';

describe('ThongTinDonHang', () => {
  let component: ThongTinDonHang;
  let fixture: ComponentFixture<ThongTinDonHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThongTinDonHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongTinDonHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

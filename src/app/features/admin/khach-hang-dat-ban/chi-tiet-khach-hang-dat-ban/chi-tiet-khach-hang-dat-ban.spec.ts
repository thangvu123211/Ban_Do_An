import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietKhachHangDatBan } from './chi-tiet-khach-hang-dat-ban';

describe('ChiTietKhachHangDatBan', () => {
  let component: ChiTietKhachHangDatBan;
  let fixture: ComponentFixture<ChiTietKhachHangDatBan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiTietKhachHangDatBan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiTietKhachHangDatBan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhachHangDatBan } from './khach-hang-dat-ban';

describe('KhachHangDatBan', () => {
  let component: KhachHangDatBan;
  let fixture: ComponentFixture<KhachHangDatBan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhachHangDatBan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhachHangDatBan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

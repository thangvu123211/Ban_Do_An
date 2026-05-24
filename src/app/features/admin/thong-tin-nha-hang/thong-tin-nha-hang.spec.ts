import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinNhaHang } from './thong-tin-nha-hang';

describe('ThongTinNhaHang', () => {
  let component: ThongTinNhaHang;
  let fixture: ComponentFixture<ThongTinNhaHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThongTinNhaHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongTinNhaHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

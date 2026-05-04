import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeThongCuaHang } from './he-thong-cua-hang';

describe('HeThongCuaHang', () => {
  let component: HeThongCuaHang;
  let fixture: ComponentFixture<HeThongCuaHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeThongCuaHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeThongCuaHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

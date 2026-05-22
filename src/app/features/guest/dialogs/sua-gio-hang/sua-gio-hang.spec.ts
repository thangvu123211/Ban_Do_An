import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaGioHang } from './sua-gio-hang';

describe('SuaGioHang', () => {
  let component: SuaGioHang;
  let fixture: ComponentFixture<SuaGioHang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaGioHang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaGioHang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

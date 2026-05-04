import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaLoaiMonAn } from './sua-loai-mon-an';

describe('SuaLoaiMonAn', () => {
  let component: SuaLoaiMonAn;
  let fixture: ComponentFixture<SuaLoaiMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaLoaiMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaLoaiMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachMonAn } from './danh-sach-mon-an';

describe('DanhSachMonAn', () => {
  let component: DanhSachMonAn;
  let fixture: ComponentFixture<DanhSachMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhSachMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhSachMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

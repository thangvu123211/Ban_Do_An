import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyDanhGiavaBinhLuan } from './quan-ly-danh-giava-binh-luan';

describe('QuanLyDanhGiavaBinhLuan', () => {
  let component: QuanLyDanhGiavaBinhLuan;
  let fixture: ComponentFixture<QuanLyDanhGiavaBinhLuan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanLyDanhGiavaBinhLuan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyDanhGiavaBinhLuan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

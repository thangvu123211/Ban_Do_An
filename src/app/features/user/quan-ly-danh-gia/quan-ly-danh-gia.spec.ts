import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyDanhGia } from './quan-ly-danh-gia';

describe('QuanLyDanhGia', () => {
  let component: QuanLyDanhGia;
  let fixture: ComponentFixture<QuanLyDanhGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanLyDanhGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyDanhGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

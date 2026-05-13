import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyBinhLuan } from './quan-ly-binh-luan';

describe('QuanLyBinhLuan', () => {
  let component: QuanLyBinhLuan;
  let fixture: ComponentFixture<QuanLyBinhLuan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanLyBinhLuan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyBinhLuan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

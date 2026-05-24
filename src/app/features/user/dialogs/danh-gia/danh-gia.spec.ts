import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhGia } from './danh-gia';

describe('DanhGia', () => {
  let component: DanhGia;
  let fixture: ComponentFixture<DanhGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

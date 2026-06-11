import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaDanhGia } from './sua-danh-gia';

describe('SuaDanhGia', () => {
  let component: SuaDanhGia;
  let fixture: ComponentFixture<SuaDanhGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaDanhGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaDanhGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

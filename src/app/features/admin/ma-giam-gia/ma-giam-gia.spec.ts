import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaGiamGia } from './ma-giam-gia';

describe('MaGiamGia', () => {
  let component: MaGiamGia;
  let fixture: ComponentFixture<MaGiamGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaGiamGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaGiamGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

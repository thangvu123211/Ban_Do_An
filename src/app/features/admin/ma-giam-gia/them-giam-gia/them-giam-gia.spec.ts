import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemGiamGia } from './them-giam-gia';

describe('ThemGiamGia', () => {
  let component: ThemGiamGia;
  let fixture: ComponentFixture<ThemGiamGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemGiamGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemGiamGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

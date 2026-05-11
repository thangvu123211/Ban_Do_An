import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaGiamGia } from './sua-giam-gia';

describe('SuaGiamGia', () => {
  let component: SuaGiamGia;
  let fixture: ComponentFixture<SuaGiamGia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaGiamGia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaGiamGia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

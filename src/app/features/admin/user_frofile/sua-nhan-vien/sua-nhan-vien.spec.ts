import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaNhanVien } from './sua-nhan-vien';

describe('SuaNhanVien', () => {
  let component: SuaNhanVien;
  let fixture: ComponentFixture<SuaNhanVien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaNhanVien]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaNhanVien);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

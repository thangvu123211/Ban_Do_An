import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemNhanVien } from './them-nhan-vien';

describe('ThemNhanVien', () => {
  let component: ThemNhanVien;
  let fixture: ComponentFixture<ThemNhanVien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemNhanVien]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemNhanVien);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

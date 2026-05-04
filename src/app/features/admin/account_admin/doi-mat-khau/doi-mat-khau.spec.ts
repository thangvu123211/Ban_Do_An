import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoiMatKhau } from './doi-mat-khau';

describe('DoiMatKhau', () => {
  let component: DoiMatKhau;
  let fixture: ComponentFixture<DoiMatKhau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoiMatKhau]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoiMatKhau);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

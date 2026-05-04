import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemLoaiMonAn } from './them-loai-mon-an';

describe('ThemLoaiMonAn', () => {
  let component: ThemLoaiMonAn;
  let fixture: ComponentFixture<ThemLoaiMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemLoaiMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemLoaiMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

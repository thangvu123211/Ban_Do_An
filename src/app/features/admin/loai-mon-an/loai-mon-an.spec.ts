import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaiMonAn } from './loai-mon-an';

describe('LoaiMonAn', () => {
  let component: LoaiMonAn;
  let fixture: ComponentFixture<LoaiMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaiMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaiMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

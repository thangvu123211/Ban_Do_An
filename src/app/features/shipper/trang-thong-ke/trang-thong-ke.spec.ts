import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrangThongKe } from './trang-thong-ke';

describe('TrangThongKe', () => {
  let component: TrangThongKe;
  let fixture: ComponentFixture<TrangThongKe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrangThongKe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrangThongKe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

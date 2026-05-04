import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaoHoaDon } from './tao-hoa-don';

describe('TaoHoaDon', () => {
  let component: TaoHoaDon;
  let fixture: ComponentFixture<TaoHoaDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaoHoaDon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaoHoaDon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

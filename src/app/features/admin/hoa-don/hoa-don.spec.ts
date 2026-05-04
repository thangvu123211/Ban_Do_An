import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaDon } from './hoa-don';

describe('HoaDon', () => {
  let component: HoaDon;
  let fixture: ComponentFixture<HoaDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoaDon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoaDon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

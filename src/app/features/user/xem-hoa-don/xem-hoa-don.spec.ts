import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XemHoaDon } from './xem-hoa-don';

describe('XemHoaDon', () => {
  let component: XemHoaDon;
  let fixture: ComponentFixture<XemHoaDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XemHoaDon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XemHoaDon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperLayout } from './shipper-layout';

describe('ShipperLayout', () => {
  let component: ShipperLayout;
  let fixture: ComponentFixture<ShipperLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipperLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipperLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderShipper } from './header-shipper';

describe('HeaderShipper', () => {
  let component: HeaderShipper;
  let fixture: ComponentFixture<HeaderShipper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderShipper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderShipper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

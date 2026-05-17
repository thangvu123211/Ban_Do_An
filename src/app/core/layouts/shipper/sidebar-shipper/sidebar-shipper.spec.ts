import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarShipper } from './sidebar-shipper';

describe('SidebarShipper', () => {
  let component: SidebarShipper;
  let fixture: ComponentFixture<SidebarShipper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarShipper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarShipper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

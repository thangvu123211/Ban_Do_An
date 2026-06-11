import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietDatBan } from './chi-tiet-dat-ban';

describe('ChiTietDatBan', () => {
  let component: ChiTietDatBan;
  let fixture: ComponentFixture<ChiTietDatBan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiTietDatBan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiTietDatBan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

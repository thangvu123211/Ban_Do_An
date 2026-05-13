import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaHoaDon } from './sua-hoa-don';

describe('SuaHoaDon', () => {
  let component: SuaHoaDon;
  let fixture: ComponentFixture<SuaHoaDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaHoaDon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaHoaDon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

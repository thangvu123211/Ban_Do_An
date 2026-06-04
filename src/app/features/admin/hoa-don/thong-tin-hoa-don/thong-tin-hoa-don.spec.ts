import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinHoaDon } from './thong-tin-hoa-don';

describe('ThongTinHoaDon', () => {
  let component: ThongTinHoaDon;
  let fixture: ComponentFixture<ThongTinHoaDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThongTinHoaDon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongTinHoaDon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

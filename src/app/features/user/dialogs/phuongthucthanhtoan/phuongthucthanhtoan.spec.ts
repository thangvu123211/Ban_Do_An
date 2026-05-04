import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phuongthucthanhtoan } from './phuongthucthanhtoan';

describe('Phuongthucthanhtoan', () => {
  let component: Phuongthucthanhtoan;
  let fixture: ComponentFixture<Phuongthucthanhtoan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Phuongthucthanhtoan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Phuongthucthanhtoan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

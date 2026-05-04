import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanhToan } from './thanh-toan';

describe('ThanhToan', () => {
  let component: ThanhToan;
  let fixture: ComponentFixture<ThanhToan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThanhToan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanhToan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

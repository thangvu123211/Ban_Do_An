import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTin } from './thong-tin';

describe('ThongTin', () => {
  let component: ThongTin;
  let fixture: ComponentFixture<ThongTin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThongTin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongTin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

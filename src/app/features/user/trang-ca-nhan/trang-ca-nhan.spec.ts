import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrangCaNhan } from './trang-ca-nhan';

describe('TrangCaNhan', () => {
  let component: TrangCaNhan;
  let fixture: ComponentFixture<TrangCaNhan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrangCaNhan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrangCaNhan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

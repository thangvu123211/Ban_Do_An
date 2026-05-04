import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanAn } from './ban-an';

describe('BanAn', () => {
  let component: BanAn;
  let fixture: ComponentFixture<BanAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

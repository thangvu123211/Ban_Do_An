import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaBanAn } from './sua-ban-an';

describe('SuaBanAn', () => {
  let component: SuaBanAn;
  let fixture: ComponentFixture<SuaBanAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaBanAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaBanAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

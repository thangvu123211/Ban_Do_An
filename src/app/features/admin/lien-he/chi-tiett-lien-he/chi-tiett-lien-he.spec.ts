import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTiettLienHe } from './chi-tiett-lien-he';

describe('ChiTiettLienHe', () => {
  let component: ChiTiettLienHe;
  let fixture: ComponentFixture<ChiTiettLienHe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiTiettLienHe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiTiettLienHe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

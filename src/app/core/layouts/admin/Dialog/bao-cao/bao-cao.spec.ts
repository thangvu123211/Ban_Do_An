import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao } from './bao-cao';

describe('BaoCao', () => {
  let component: BaoCao;
  let fixture: ComponentFixture<BaoCao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaoCao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaoCao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

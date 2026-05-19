import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionMonAn } from './option-mon-an';

describe('OptionMonAn', () => {
  let component: OptionMonAn;
  let fixture: ComponentFixture<OptionMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

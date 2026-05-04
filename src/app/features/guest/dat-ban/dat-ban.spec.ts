import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatBan } from './dat-ban';

describe('DatBan', () => {
  let component: DatBan;
  let fixture: ComponentFixture<DatBan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatBan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatBan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

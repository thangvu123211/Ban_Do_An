import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyDatBan } from './quan-ly-dat-ban';

describe('QuanLyDatBan', () => {
  let component: QuanLyDatBan;
  let fixture: ComponentFixture<QuanLyDatBan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanLyDatBan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyDatBan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChonbanDialog } from './chonban-dialog';

describe('ChonbanDialog', () => {
  let component: ChonbanDialog;
  let fixture: ComponentFixture<ChonbanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChonbanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChonbanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

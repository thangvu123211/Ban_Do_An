import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonAn } from './mon-an';

describe('MonAn', () => {
  let component: MonAn;
  let fixture: ComponentFixture<MonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

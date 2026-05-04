import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMonAn } from './them-mon-an';

describe('ThemMonAn', () => {
  let component: ThemMonAn;
  let fixture: ComponentFixture<ThemMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

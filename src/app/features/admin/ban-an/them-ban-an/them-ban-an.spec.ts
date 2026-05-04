import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemBanAn } from './them-ban-an';

describe('ThemBanAn', () => {
  let component: ThemBanAn;
  let fixture: ComponentFixture<ThemBanAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemBanAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemBanAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoiMonMenu } from './goi-mon-menu';

describe('GoiMonMenu', () => {
  let component: GoiMonMenu;
  let fixture: ComponentFixture<GoiMonMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoiMonMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoiMonMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

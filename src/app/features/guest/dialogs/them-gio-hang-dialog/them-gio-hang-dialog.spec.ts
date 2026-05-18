import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemGioHangDialog } from './them-gio-hang-dialog';

describe('ThemGioHangDialog', () => {
  let component: ThemGioHangDialog;
  let fixture: ComponentFixture<ThemGioHangDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemGioHangDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemGioHangDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

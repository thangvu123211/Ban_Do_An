import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaMonAn } from './sua-mon-an';

describe('SuaMonAn', () => {
  let component: SuaMonAn;
  let fixture: ComponentFixture<SuaMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuaMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

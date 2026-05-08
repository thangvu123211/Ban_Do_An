import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinMonAn } from './thong-tin-mon-an';

describe('ThongTinMonAn', () => {
  let component: ThongTinMonAn;
  let fixture: ComponentFixture<ThongTinMonAn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThongTinMonAn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongTinMonAn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

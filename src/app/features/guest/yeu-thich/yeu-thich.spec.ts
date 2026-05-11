import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeuThich } from './yeu-thich';

describe('YeuThich', () => {
  let component: YeuThich;
  let fixture: ComponentFixture<YeuThich>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YeuThich]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YeuThich);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

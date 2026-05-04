import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFrofileComponents } from './user_frofile';

describe('UserFrofile', () => {
  let component: UserFrofileComponents;
  let fixture: ComponentFixture<UserFrofileComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFrofileComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFrofileComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

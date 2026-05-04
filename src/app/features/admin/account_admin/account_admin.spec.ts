import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Account_admincomponent } from './account_admin';

describe('Account', () => {
  let component: Account_admincomponent;
  let fixture: ComponentFixture<Account_admincomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account_admincomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Account_admincomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

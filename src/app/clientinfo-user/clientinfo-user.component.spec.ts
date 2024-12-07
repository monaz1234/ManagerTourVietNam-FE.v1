import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientinfoUserComponent } from './clientinfo-user.component';

describe('ClientinfoUserComponent', () => {
  let component: ClientinfoUserComponent;
  let fixture: ComponentFixture<ClientinfoUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientinfoUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientinfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienthoteldetailComponent } from './clienthoteldetail.component';

describe('ClienthoteldetailComponent', () => {
  let component: ClienthoteldetailComponent;
  let fixture: ComponentFixture<ClienthoteldetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienthoteldetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienthoteldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

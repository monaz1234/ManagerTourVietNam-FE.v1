import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHotelComponent } from './client-hotel.component';

describe('ClientHotelComponent', () => {
  let component: ClientHotelComponent;
  let fixture: ComponentFixture<ClientHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

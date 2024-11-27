import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLienHeComponent } from './client-lienhe.component';

describe('ClientLienHeComponent', () => {
  let component: ClientLienHeComponent;
  let fixture: ComponentFixture<ClientLienHeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientLienHeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLienHeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

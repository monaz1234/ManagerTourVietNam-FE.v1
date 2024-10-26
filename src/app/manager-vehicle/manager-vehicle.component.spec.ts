import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerVehicleComponent } from './manager-vehicle.component';

describe('ManagerVehicleComponent', () => {
  let component: ManagerVehicleComponent;
  let fixture: ComponentFixture<ManagerVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

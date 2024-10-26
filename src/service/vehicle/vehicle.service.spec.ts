import { TestBed } from '@angular/core/testing';

import { ManagerVehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: ManagerVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ManagerHotelService } from './manager-hotel.service';

describe('ManagerHotelService', () => {
  let service: ManagerHotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerHotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

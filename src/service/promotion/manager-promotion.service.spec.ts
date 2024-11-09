import { TestBed } from '@angular/core/testing';

import { ManagerPromotionService } from './manager-promotion.service';

describe('ManagerHotelService', () => {
  let service: ManagerPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerPromotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
